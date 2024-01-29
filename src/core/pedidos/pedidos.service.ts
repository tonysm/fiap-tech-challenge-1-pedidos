import { Inject, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from 'src/externals/apis/dto/create-pedido.dto';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { ItemVO } from './vo/item.vo';
import { UpdatePedidoItemDto } from 'src/externals/apis/dto/update-pedido-item.dto';
import { PedidosRepositoryInterface } from './repositories/pedidos.repository';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosServiceInterface } from './pedido.service.interface';
import { NaoPodeSolicitarPagamento } from './exceptions/pedido.exception';
import { PagamentosServiceInterface } from './services/pagamentos.service.interface';
import { ProducaoServiceInterface, PedidoProducaoDTO } from './services/producao.service.interface';

@Injectable()
export class PedidosService implements PedidosServiceInterface {
  constructor(
    @Inject(PedidosRepository)
    private readonly repository: PedidosRepositoryInterface,
    private readonly pedidoAggregateFactory: PedidoAggregateFactory,
  ) {}

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOneOrFail(id);
  }

  async create(input: CreatePedidoDto) {
    const pedidoAggregate = await this.pedidoAggregateFactory.createNew(input);
    return pedidoAggregate.toEntity();
  }

  async addItem(id: number, item: ItemVO) {
    const pedidoAggregate = await this.pedidoAggregateFactory.createFromId(id);

    pedidoAggregate.adicionarItem(item);

    return pedidoAggregate.toEntity();
  }

  async updateItem(
    pedidoId: number,
    itemId: number,
    input: UpdatePedidoItemDto,
  ) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId);

    aggregate.atualizaItem(itemId, input.quantidade, input.observacao);

    return aggregate.toEntity();
  }

  findOneItem(id: number) {
    return this.repository.findOneItem(id);
  }

  async removeItem(pedidoId: number, id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId);

    aggregate.removeItem(id);

    this.repository.deleteItem(id);

    return aggregate.toEntity();
  }

  async solicitarPagamento(
    pedidoId: number,
    gatewayPagamento: PagamentosServiceInterface,
  ) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)

    if (! aggregate.podeSolicitarPagamento()) {
        throw new NaoPodeSolicitarPagamento(aggregate.toEntity())
    }

    this.repository.save(aggregate.marcarComoProcessando())

    try {
        await gatewayPagamento.solicitarPagamento(pedidoId, aggregate.valorTotal())
    } catch (e) {
        aggregate.pagamentoFalhou()
    }

    const entity = aggregate.toEntity()

    this.repository.save(entity)

    return entity
  }

  async confirmarPagamento(
    pedidoId: number,
    pagoComSucesso: boolean,
    gatewayProducao: ProducaoServiceInterface,
  ) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)

    if (pagoComSucesso) {
        aggregate.pagamentoComSucesso(new Date)
        aggregate.iniciarPreparacao()
    } else {
        aggregate.pagamentoFalhou()
    }

    const entity = aggregate.toEntity()

    this.repository.save(entity);

    if (pagoComSucesso) {
        gatewayProducao.iniciarProducao(PedidoProducaoDTO.fromEntity(entity))
    }

    return entity
  }

  async finalizar(pedidoId: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId);

    aggregate.finalizarPedido();

    return await this.repository.save(aggregate.toEntity());
  }
}

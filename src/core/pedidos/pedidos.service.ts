import { Inject, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from 'src/adapter/driver/controllers/dto/create-pedido.dto';
import { Status, StatusPagamento } from './entities/pedido.entity';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { PagamentoFalhou, StatusInvalidoException } from './exceptions/pedido.exception';
import { ItemVO } from './vo/item.vo';
import { UpdatePedidoItemDto } from 'src/adapter/driver/controllers/dto/update-pedido-item.dto';
import { PagamentoGateway } from '../pagamentos/pagamento.gateway';
import { PedidosRepositoryInterface } from './repositories/pedidos.repository';
import { PedidosRepository } from 'src/adapter/driven/infrastructure/repositories/pedidos.repository';

@Injectable()
export class PedidosService {
  constructor(
    @Inject(PedidosRepository)
    private readonly repository: PedidosRepositoryInterface,
    private readonly pedidoAggregateFactory: PedidoAggregateFactory
  ) {}

  findAll() {
    return this.repository.findAll();
  }

  findAllParaCozinha() {
    return this.repository.findAllParaCozinha();
  }

  findOne(id: number) {
    return this.repository.findOneOrFail(id);
  }

  async create(input: CreatePedidoDto) {
    const pedidoAggregate = await this.pedidoAggregateFactory.createNew(input)

    return this.repository.save(pedidoAggregate.toEntity());
  }

  async addItem(id: number, item: ItemVO) {
    const pedidoAggregate = await this.pedidoAggregateFactory.createFromId(id);

    pedidoAggregate.adicionarItem(item);

    return this.repository.save(pedidoAggregate.toEntity());
  }

  async updateItem(pedidoId: number, itemId: number, input: UpdatePedidoItemDto) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId);

    aggregate.atualizaItem(itemId, input.quantidade, input.observacao)

    return this.repository.save(aggregate.toEntity());
  }

  findOneItem(id: number) {
    return this.repository.findOneItem(id);
  }

  async removeItem(pedidoId: number, id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)

    aggregate.removeItem(id)

    this.repository.deleteItem(id);
  }

  async confirmaPagamento(pedidoId: number, pagamentos: PagamentoGateway) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)

    await aggregate.confirmaPagamento(pagamentos);

    const pedido = await this.repository.save(aggregate.toEntity())

    if (pedido.statusPagamento === StatusPagamento.FALHOU) {
        throw new PagamentoFalhou(pedido);
    }

    return pedido;
  }

  async atualizaStatusDoPedido(id: number, status: Status) {
    switch (status) {
      case Status.EM_PREPARACAO:
        return this.iniciarPreparacaoDoPedido(id)
      case Status.PRONTO:
        return this.encerrarPreparacaoDoPedido(id)
      case Status.FINALIZADO:
        return this.finalizarPedido(id)
      default:
        throw new StatusInvalidoException()
    }
  }

  private async iniciarPreparacaoDoPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)

    aggregate.iniciarPreparacaoDoPedido()

    this.repository.save(aggregate.toEntity())
  }

  private async encerrarPreparacaoDoPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)

    aggregate.encerrarPreparacaoDoPedido()

    this.repository.save(aggregate.toEntity())
  }

  private async finalizarPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)

    aggregate.finalizarPedido()

    this.repository.save(aggregate.toEntity())
  }
}

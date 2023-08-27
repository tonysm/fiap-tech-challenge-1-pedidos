import { Inject, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from 'src/externals/apis/dto/create-pedido.dto';
import { Status, StatusPagamento } from './entities/pedido.entity';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { PagamentoFalhou, StatusInvalidoException } from './exceptions/pedido.exception';
import { ItemVO } from './vo/item.vo';
import { UpdatePedidoItemDto } from 'src/externals/apis/dto/update-pedido-item.dto';
import { PagamentoGateway } from '../pagamentos/pagamento.gateway';
import { PedidosRepositoryInterface } from './repositories/pedidos.repository';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosServiceInterface } from './pedido.service.interface';
import { ConfirmaPedidoDto } from 'src/externals/apis/dto/confirma-pedido.dto';

@Injectable()
export class PedidosService implements PedidosServiceInterface {
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
    return pedidoAggregate.toEntity()
  }

  async addItem(id: number, item: ItemVO) {
    const pedidoAggregate = await this.pedidoAggregateFactory.createFromId(id);

    pedidoAggregate.adicionarItem(item);

    return pedidoAggregate.toEntity()
  }

  async updateItem(pedidoId: number, itemId: number, input: UpdatePedidoItemDto) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId);

    aggregate.atualizaItem(itemId, input.quantidade, input.observacao)

    return aggregate.toEntity()
  }

  findOneItem(id: number) {
    return this.repository.findOneItem(id);
  }

  async removeItem(pedidoId: number, id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)

    aggregate.removeItem(id)

    this.repository.deleteItem(id);
    return aggregate.toEntity()
  }

  async confirmaPagamento(pedidoId: number, input: ConfirmaPedidoDto) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)

    await aggregate.confirmaPagamento(input);

    return aggregate.toEntity()
  }

  async checkout(pedidoId: number, pagamentos: PagamentoGateway) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)
    aggregate.checkout(pagamentos)
    return aggregate.toEntity()
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

    return aggregate.toEntity()
  }

  private async encerrarPreparacaoDoPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)

    aggregate.encerrarPreparacaoDoPedido()

    return aggregate.toEntity()
  }

  private async finalizarPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)

    aggregate.finalizarPedido()

    return aggregate.toEntity()
  }
}

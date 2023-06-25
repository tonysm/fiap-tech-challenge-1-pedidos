import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from 'src/adapter/driver/controllers/dto/create-pedido.dto';
import { Pedido, Status, StatusPagamento } from './entities/pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { PedidoNaoEncontrado, StatusInvalidoException } from './exceptions/pedido.exception';
import { ItemVO } from './vo/item.vo';
import { Item } from './entities/item.entity';
import { UpdatePedidoItemDto } from 'src/adapter/driver/controllers/dto/update-pedido-item.dto';
import { PaymentGateway } from '../payments/payment.gateway';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private repository: Repository<Pedido>,
    @InjectRepository(Item)
    private items: Repository<Item>,
    private readonly pedidoAggregateFactory: PedidoAggregateFactory
  ) {}

  findAll() {
    return this.repository.find({ loadEagerRelations: true })
  }

  findAllParaCozinha() {
    return this.repository.createQueryBuilder('pedido')
        .where('pedido.status NOT IN (:status)', { status: [Status.CRIANDO, Status.FINALIZADO] })
        .innerJoinAndSelect("pedido.items", "item")
        .innerJoinAndSelect("pedido.cliente", "cliente")
        .getMany()
  }

  async findOne(id: number) {
    const pedido = await this.repository.findOneBy({ id });

    if (! pedido) throw new PedidoNaoEncontrado;

    return pedido;
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
    return this.items.findOneBy({ id });
  }

  async removeItem(pedidoId: number, id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)

    aggregate.removeItem(id)

    this.items.delete({ id })
  }

  async confirmaPagamento(pedidoId: number, payments: PaymentGateway) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(pedidoId)

    payments.checkout(aggregate);

    aggregate.confirmaPagamento();

    return this.repository.save(aggregate.toEntity())
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

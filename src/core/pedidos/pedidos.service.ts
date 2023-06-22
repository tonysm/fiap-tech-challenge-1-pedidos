import { Inject, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from 'src/adapter/driver/controllers/dto/create-pedido.dto';
import { Pedido, Status } from './entities/pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { StatusInvalidoException } from './exceptions/pedido.exception';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private repository: Repository<Pedido>,
    private readonly pedidoAggregateFactory: PedidoAggregateFactory
  ) {}

  findAll() {
    return this.repository.find({ loadEagerRelations: true })
  }

  async create(input: CreatePedidoDto) {
    const pedidoAggregate = await this.pedidoAggregateFactory.createNew(input)
    return this.repository.save(await pedidoAggregate.toEntity());
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
    this.repository.save(await aggregate.toEntity())
  }

  private async encerrarPreparacaoDoPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)

    aggregate.encerrarPreparacaoDoPedido()
    this.repository.save(await aggregate.toEntity())
  }

  private async finalizarPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)

    aggregate.finalizarPedido()
    this.repository.save(await aggregate.toEntity())
  }
}

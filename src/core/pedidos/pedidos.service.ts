import { Inject, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';

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

  async iniciarPreparacaoDoPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)
    
    aggregate.iniciarPreparacaoDoPedido()
    this.repository.save(await aggregate.toEntity())
  }

  async encerrarPreparacaoDoPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)
    
    aggregate.encerrarPreparacaoDoPedido()
    this.repository.save(await aggregate.toEntity())
  }

  async finalizarPedido(id: number) {
    const aggregate = await this.pedidoAggregateFactory.createFromId(id)
    
    aggregate.finalizarPedido()
    this.repository.save(await aggregate.toEntity())
  }
}

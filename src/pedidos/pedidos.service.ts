import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Pedido } from './entities/pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private repository: Repository<Pedido>
  ) {}

  findAll() {
    return this.repository.find({ loadEagerRelations: true })
  }

  create(input: CreatePedidoDto) {
    return this.repository.save(input);
  }
}

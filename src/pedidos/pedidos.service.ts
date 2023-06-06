import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Pedido } from './entities/pedido.entity';

@Injectable()
export class PedidosService {
  private readonly pedidos: Pedido[] = [];

  create(createPedidoDto: CreatePedidoDto): Pedido {
    let pedido = new Pedido();
    pedido.id = 123;
    this.pedidos.push(pedido);
    return pedido;
  }
}

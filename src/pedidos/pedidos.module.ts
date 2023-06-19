import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Item } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Item])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}

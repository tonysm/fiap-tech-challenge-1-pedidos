import { Module } from '@nestjs/common';
import { PedidosController } from '../../adapter/driver/controllers/pedidos.controller';
import { PedidosService } from './pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Item } from './entities/item.entity';
import { ProdutosModule } from '../produtos/produtos.module';
import { ClientesModule } from '../clientes/clientes.module';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { PedidoItemsController } from 'src/adapter/driver/controllers/pedido_items.controller';
import { ProdutosService } from '../produtos/produtos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Item]), ProdutosModule, ClientesModule],
  controllers: [PedidosController, PedidoItemsController],
  providers: [PedidoAggregateFactory, PedidosService, ProdutosService],
})
export class PedidosModule {}

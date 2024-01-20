import { Module } from '@nestjs/common';
import { PedidosAPI } from '../../externals/apis/pedidos.api';
import { PedidosService } from './pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Item } from './entities/item.entity';
import { ProdutosModule } from '../produtos/produtos.module';
import { ClientesModule } from '../clientes/clientes.module';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { PedidoItensAPI } from 'src/externals/apis/pedido_itens.api';
import { ProdutosService } from '../produtos/produtos.service';
import { PagamentoFakeGateway } from '../../externals/gateways/pagmento-fake.gateway';
import { PedidosConfirmadosAPI } from 'src/externals/apis/pedidos_confirmados.api';
import { FilaCozinhaAPI } from 'src/externals/apis/fila_cozinha_api';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosServiceInterface } from './pedido.service.interface';
import { PedidosController } from './controller/pedidos.controller';
import { PedidosControllerInterface } from './controller/pedidos.controller.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, Item]),
    ProdutosModule,
    ClientesModule,
  ],
  controllers: [
    PedidosAPI,
    PedidoItensAPI,
    PedidosConfirmadosAPI,
    FilaCozinhaAPI,
  ],
  providers: [
    PedidoAggregateFactory,
    PedidosService,
    {
      provide: PedidosServiceInterface,
      useClass: PedidosService,
    },
    ProdutosService,
    PedidosRepository,
    PagamentoFakeGateway,
    PedidosController,
    {
      provide: PedidosControllerInterface,
      useClass: PedidosController,
    },
  ],
  exports: [PagamentoFakeGateway, PedidosRepository],
})
export class PedidosModule {}

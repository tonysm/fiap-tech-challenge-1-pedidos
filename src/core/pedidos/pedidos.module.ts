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
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosServiceInterface } from './pedido.service.interface';
import { PedidosController } from './controller/pedidos.controller';
import { PedidosControllerInterface } from './controller/pedidos.controller.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PedidoPagamentosAPI } from 'src/externals/apis/pedido_pagamentos.api';
import { PubSubService } from 'src/externals/channels/pubsub.service';
import { ConfirmarPagamentoChannel } from 'src/externals/channels/confirmar.pagamento.channel';
import { SolicitarPagamentoChannel } from 'src/externals/channels/solicitar.pagamento.channel';
import { ClientesService } from '../clientes/clientes.service';
import { ClientesServiceInterface } from '../clientes/clientes.service.interface';
import { ProducaoServiceInterface } from './services/producao.service.interface';
import { ProducaoApiService, ProducaoFactory, ProducaoService } from 'src/externals/services/producao.service';
import { PedidosFinalizadosAPI } from 'src/externals/apis/pedidos_finalizados.api';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, Item]),
    ProdutosModule,
    ClientesModule,
    ConfigModule,
    HttpModule,
  ],
  controllers: [
    PedidosAPI,
    PedidoItensAPI,
    PedidoPagamentosAPI,
    PedidosFinalizadosAPI,
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
    PedidosController,
    {
      provide: PedidosControllerInterface,
      useClass: PedidosController,
    },
    ClientesService,
    {
      provide: ClientesServiceInterface,
      useClass: ClientesService,
    },
    {
        provide: ProducaoServiceInterface,
        useClass: ProducaoService,
    },
    {
        provide: ProducaoService,
        useFactory: ProducaoFactory,
        inject: [ConfigService, HttpService],
    },
    PubSubService,
    ConfirmarPagamentoChannel,
    SolicitarPagamentoChannel,
  ],
  exports: [PedidosRepository],
})
export class PedidosModule {}

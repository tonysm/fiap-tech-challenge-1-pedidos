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
import { PagamentosServiceInterface } from './services/pagamentos.service.interface';
import { PagamentosAPIService, PagamentosService } from 'src/externals/services/pagamentos.service';
import { ProducaoServiceInterface } from './services/producao.service.interface';
import { ProducaoApiService, ProducaoService } from 'src/externals/services/producao.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PedidosFinalizadosAPI } from 'src/externals/apis/pedidos_finalizados.api';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PedidoPagamentosAPI } from 'src/externals/apis/pedido_pagamentos.api';

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

    {
        provide: PagamentosServiceInterface,
        useClass: PagamentosService,
    },
    {
        provide: PagamentosService,
        useFactory(config: ConfigService, http: HttpService) {
            if (config.getOrThrow<string>('PAGAMENTOS_PROVIDER') === 'fake') {
                return new PagamentosService();
            }

            return new PagamentosAPIService(config.getOrThrow<string>('PAGAMENTOS_API_URL'), http);
        },
        inject: [ConfigService, HttpService],
    },
    {
        provide: ProducaoServiceInterface,
        useClass: ProducaoService,
    },
    {
        provide: ProducaoService,
        useFactory(config: ConfigService, http: HttpService) {
            if (config.getOrThrow<string>('PRODUCAO_PROVIDER') === 'fake') {
                return new ProducaoService();
            }

            return new ProducaoApiService(config.getOrThrow<string>('PRODUCAO_API_URL'), http);
        },
        inject: [ConfigService, HttpService],
    },
  ],
  exports: [PedidosRepository],
})
export class PedidosModule {}

import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesAPI } from '../../externals/apis/clientes.api';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ClientesRepositoryInterface } from './repositories/clientes.repository';
import { ClientesRepository } from 'src/externals/repositories/clientes.repository';
import { ClientesServiceInterface } from './clientes.service.interface';
import { ClientesController } from './controller/clientes.controller';
import { ClientesControllerInterface } from './controller/clientes.controller.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PedidosService } from '../pedidos/pedidos.service';
import { PedidosServiceInterface } from '../pedidos/pedido.service.interface';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { ConfirmarPagamentoChannel } from 'src/externals/channels/confirmar.pagamento.channel';
import { SolicitarPagamentoChannel } from 'src/externals/channels/solicitar.pagamento.channel';
import { PubSubService } from 'src/externals/channels/pubsub.service';
import { PedidoAggregateFactory } from '../pedidos/aggregates/pedido.aggregate.factory';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosRepositoryInterface } from '../pedidos/repositories/pedidos.repository';
import { Item } from '../pedidos/entities/item.entity';
import { ProducaoServiceInterface } from '../pedidos/services/producao.service.interface';
import { ProducaoApiService, ProducaoFactory, ProducaoService } from 'src/externals/services/producao.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente, Pedido, Item]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [ClientesAPI],
  providers: [
    ClientesRepository,
    ClientesService,
    {
      provide: ClientesRepositoryInterface,
      useClass: ClientesRepository,
    },
    {
      provide: ClientesServiceInterface,
      useClass: ClientesService,
    },
    ClientesController,
    {
      provide: ClientesControllerInterface,
      useClass: ClientesController,
    },
    PedidosRepository,
    {
      provide: PedidosRepositoryInterface,
      useClass: PedidosRepository,
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
    PedidoAggregateFactory,
    PubSubService,
    ConfirmarPagamentoChannel,
    SolicitarPagamentoChannel,
    PedidosService,
    {
      provide: PedidosServiceInterface,
      useClass: PedidosService,
    },
  ],
  exports: [ClientesRepository],
})
export class ClientesModule {}

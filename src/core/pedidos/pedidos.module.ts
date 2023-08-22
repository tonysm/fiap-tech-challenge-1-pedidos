import { Module } from '@nestjs/common';
import { PedidosController } from '../../externals/apis/pedidos.api';
import { PedidosService } from './pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Item } from './entities/item.entity';
import { ProdutosModule } from '../produtos/produtos.module';
import { ClientesModule } from '../clientes/clientes.module';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { PedidoItensController } from 'src/externals/apis/pedido_itens.api';
import { ProdutosService } from '../produtos/produtos.service';
import { PagamentoFakeGateway } from '../../externals/gateways/pagmento-fake.gateway';
import { PedidosConfirmadosController } from 'src/externals/apis/pedidos_confirmados.api';
import { FilaCozinhaController } from 'src/externals/apis/fila_cozinha_api';
import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosServiceInterface } from './pedido.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Item]), ProdutosModule, ClientesModule],
  controllers: [PedidosController, PedidoItensController, PedidosConfirmadosController, FilaCozinhaController],
  providers: [
    PedidoAggregateFactory,
    PedidosService,
    {
      provide: PedidosServiceInterface,
      useClass: PedidosService
    },
    ProdutosService,
    PedidosRepository,
    PagamentoFakeGateway,
  ],
  exports: [PagamentoFakeGateway, PedidosRepository],
})
export class PedidosModule {}

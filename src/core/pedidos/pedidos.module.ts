import { Module } from '@nestjs/common';
import { PedidosController } from '../../adapter/driver/controllers/pedidos.controller';
import { PedidosService } from './pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Item } from './entities/item.entity';
import { ProdutosModule } from '../produtos/produtos.module';
import { ClientesModule } from '../clientes/clientes.module';
import { PedidoAggregateFactory } from './aggregates/pedido.aggregate.factory';
import { PedidoItensController } from 'src/adapter/driver/controllers/pedido_itens.controller';
import { ProdutosService } from '../produtos/produtos.service';
import { PagamentoGateway } from '../pagamentos/pagamento.gateway';
import { PagamentoFakeGateway } from '../../adapter/driven/infrastructure/pagamentos/pagmento-fake.gateway';
import { PedidosConfirmadosController } from 'src/adapter/driver/controllers/pedidos_confirmados.controller';
import { FilaCozinhaController } from 'src/adapter/driver/controllers/fila_cozinha_controller';
import { PedidosRepositoryInterface } from './repositories/pedidos.repository';
import { PedidosRepository } from 'src/adapter/driven/infrastructure/repositories/pedidos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Item]), ProdutosModule, ClientesModule],
  controllers: [PedidosController, PedidoItensController, PedidosConfirmadosController, FilaCozinhaController],
  providers: [
    PedidoAggregateFactory,
    PedidosService,
    ProdutosService,
    PedidosRepository,
    PagamentoFakeGateway,
  ],
  exports: [PagamentoFakeGateway, PedidosRepository],
})
export class PedidosModule {}

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
import { PaymentGateway } from '../payments/payment.gateway';
import { FakePaymentGateway } from '../payments/fake_payment.gateway';
import { PedidosConfirmadosController } from 'src/adapter/driver/controllers/pedidos_confirmados.controller';
import { FilaCozinhaController } from 'src/adapter/driver/controllers/fila_cozinha_controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Item]), ProdutosModule, ClientesModule],
  controllers: [PedidosController, PedidoItemsController, PedidosConfirmadosController, FilaCozinhaController],
  providers: [PedidoAggregateFactory, PedidosService, ProdutosService, {
    provide: PaymentGateway,
    useClass: FakePaymentGateway,
  }],
  exports: [PaymentGateway],
})
export class PedidosModule {}

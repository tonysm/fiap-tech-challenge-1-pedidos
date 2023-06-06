import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [PedidosModule, ProdutosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

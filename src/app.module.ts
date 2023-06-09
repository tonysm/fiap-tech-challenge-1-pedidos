import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [ConfigModule.forRoot(), PedidosModule, ProdutosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

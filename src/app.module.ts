import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [PedidosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

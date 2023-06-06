import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';

@Module({
  controllers: [ProdutosController],
  providers: [ProdutosService]
})
export class ProdutosModule {}

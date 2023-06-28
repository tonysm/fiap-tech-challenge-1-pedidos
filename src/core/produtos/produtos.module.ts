import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from 'src/adapter/driver/controllers/produtos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutosRepository } from 'src/adapter/driven/infrastructure/repositories/produtos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [ProdutosController],
  providers: [ProdutosRepository, ProdutosService],
  exports: [ProdutosRepository]
})
export class ProdutosModule {}

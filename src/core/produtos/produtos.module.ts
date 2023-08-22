import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from 'src/externals/apis/produtos.api';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutosRepository } from 'src/externals/repositories/produtos.repository';
import { ProdutosServiceInterface } from './produtos.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [ProdutosController],
  providers: [ProdutosRepository, ProdutosService, {
    provide: ProdutosServiceInterface,
    useClass: ProdutosService
  }],
  exports: [ProdutosRepository]
})
export class ProdutosModule {}

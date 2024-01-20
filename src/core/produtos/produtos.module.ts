import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosAPI } from 'src/externals/apis/produtos.api';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutosRepository } from 'src/externals/repositories/produtos.repository';
import { ProdutosServiceInterface } from './produtos.service.interface';
import { ProdutosControllerInterface } from './controller/produtos.controller.interface';
import { ProdutosController } from './controller/produtos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [ProdutosAPI],
  providers: [
    ProdutosRepository,
    ProdutosService,
    {
      provide: ProdutosServiceInterface,
      useClass: ProdutosService,
    },
    ProdutosController,
    {
      provide: ProdutosControllerInterface,
      useClass: ProdutosController,
    },
  ],
  exports: [ProdutosRepository],
})
export class ProdutosModule { }

import { Inject, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from '../../../externals/apis/dto/create-produto.dto';
import { UpdateProdutoDto } from 'src/externals/apis/dto/update-produto.dto';
import { Categoria } from './../entities/produto.entity';
import { ProdutosRepositoryInterface } from './../repositories/produtos.repository';
import { ProdutosRepository } from 'src/externals/repositories/produtos.repository';
import { ProdutosServiceInterface } from './../produtos.service.interface';
import { ProdutosControllerInterface } from './produtos.controller.interface';

@Injectable()
export class ProdutosController implements ProdutosControllerInterface {
  constructor(
    @Inject(ProdutosRepository)
    private readonly repository: ProdutosRepositoryInterface,
    @Inject(ProdutosServiceInterface)
    private readonly produtosService: ProdutosServiceInterface,
  ) {}

  create(input: CreateProdutoDto) {
    const produtoCriado = this.produtosService.create(input);
    return this.repository.save(produtoCriado);
  }

  findAll() {
    return this.produtosService.findAll();
  }

  findAllByCategoria(categoria: Categoria) {
    return this.produtosService.findAllByCategoria(categoria);
  }

  findOne(id: number) {
    return this.produtosService.findOne(id);
  }

  async update(id: number, input: UpdateProdutoDto) {
    const produtoAtualizado = await this.produtosService.update(id, input);
    this.repository.save(produtoAtualizado);
  }

  remove(id: number) {
    this.produtosService.remove(id);
  }
}

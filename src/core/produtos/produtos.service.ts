import { Inject, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from '../../externals/apis/dto/create-produto.dto';
import { UpdateProdutoDto } from 'src/externals/apis/dto/update-produto.dto';
import { Categoria, Produto } from './entities/produto.entity';
import { ProdutosRepositoryInterface } from './repositories/produtos.repository';
import { ProdutosRepository } from 'src/externals/repositories/produtos.repository';
import { ProdutoNaoEncontrado } from './exceptions/produto.exception';
import { ProdutosServiceInterface } from './produtos.service.interface';

@Injectable()
export class ProdutosService implements ProdutosServiceInterface {
  constructor(
    @Inject(ProdutosRepository)
    private readonly repository: ProdutosRepositoryInterface
  ) {}

  create(input: CreateProdutoDto) {
    return Produto.createFrom({
      nome: input.nome,
      categoria: input.categoria,
      descricao: input.descricao,
      precoUnitario: input.precoUnitario
    })
  }

  findAll() {
    return this.repository.findAll()
  }

  findAllByCategoria(categoria: Categoria) {
    return this.repository.findAllByCategoria(categoria)
  }

  findOne(id: number) {
    return this.repository.findById(id)
  }

  async update(id: number, {nome, categoria, descricao, precoUnitario}: UpdateProdutoDto) {
    const produto  = await this.repository.findById(id)

    if(! produto) {
      throw new ProdutoNaoEncontrado
    }

    return produto.fill({nome, categoria, descricao, precoUnitario})
  }

  remove(id: number) {
    this.repository.delete(id)
  }
}

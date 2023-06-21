import { Inject, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Categoria, Produto } from './entities/produto.entity';
import { ProdutosRepositoryInterface } from './repositories/produtos.repository';
import { ProdutosRepository } from 'src/adapter/driven/infrastructure/repositories/produtos.repository';
import { ProdutoNaoEncontrado } from './exceptions/produto.exception';

@Injectable()
export class ProdutosService {
  constructor(
    @Inject(ProdutosRepository)
    private repository: ProdutosRepositoryInterface
  ) {}
  create(input: CreateProdutoDto) {
    return this.repository.save(Produto.createFrom({
      nome: input.nome,
      categoria: input.categoria,
      descricao: input.descricao
    }))
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

  async update(id: number, { nome, categoria, descricao }: UpdateProdutoDto) {
    const produto  = await this.repository.findById(id)

    if(! produto) {
      throw new ProdutoNaoEncontrado
    }

    this.repository.save(produto.fill({nome, categoria, descricao}))
  }

  remove(id: number) {
    this.repository.delete(id)
  }
}

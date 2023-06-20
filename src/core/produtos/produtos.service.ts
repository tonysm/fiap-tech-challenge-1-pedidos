import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria, Produto } from './entities/produto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private repository: Repository<Produto>
  ) {}
  create(input: CreateProdutoDto) {
    return this.repository.save(input)
  }

  findAll() {
    return this.repository.find()
  }

  findAllByCategoria(categoria: Categoria) {
    return this.repository.findBy({ categoria })
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id })
  }

  update(id: number, input: UpdateProdutoDto) {
    this.repository.update({ id }, input)
  }

  remove(id: number) {
    this.repository.delete({ id })
  }
}

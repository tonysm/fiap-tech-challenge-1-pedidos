import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categoria, Produto } from "src/core/produtos/entities/produto.entity";
import { ProdutosRepositoryInterface } from "src/core/produtos/repositories/produtos.repository";
import { Repository } from "typeorm";

@Injectable()
export class ProdutosRepository implements ProdutosRepositoryInterface {

    constructor(
        @InjectRepository(Produto)
        private repository: Repository<Produto>
    ) {}

    save(produto: Produto): Promise<Produto> {
        return this.repository.save(produto)
    }

    findAll(): Promise<Produto[]> {
        return this.repository.find()
    }

    findById(id: number): Promise<Produto> {
        return this.repository.findOneBy({ id })
    }

    delete(id: number): void {
        this.repository.delete({ id })
    }

    findAllByCategoria(categoria: Categoria): Promise<Produto[]> {
        return this.repository.findBy({ categoria })
    }
}
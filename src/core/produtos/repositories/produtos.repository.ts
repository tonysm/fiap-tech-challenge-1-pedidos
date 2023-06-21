import { Categoria, Produto } from "../entities/produto.entity";

export interface ProdutosRepositoryInterface {
   save(produto: Produto): Promise<Produto>;

   findAll(): Promise<Produto[]>;

   findById(id: number): Promise<Produto>;

   delete(id: number): void;

   findAllByCategoria(categoria: Categoria): Promise<Produto[]>;
}

export const ProdutosRepositoryInterface = Symbol('ProdutosRepositoryInterface')
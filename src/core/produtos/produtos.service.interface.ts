import { CreateProdutoDto } from "src/adapter/driver/controllers/dto/create-produto.dto"
import { Categoria } from "./entities/produto.entity"
import { UpdateProdutoDto } from "src/adapter/driver/controllers/dto/update-produto.dto"

export interface ProdutosServiceInterface {
    create(input: CreateProdutoDto)
    findAll()
    findAllByCategoria(categoria: Categoria)
    findOne(id: number)
    update(id: number, { nome, categoria, descricao, precoUnitario }: UpdateProdutoDto)
    remove(id: number)
}

export const ProdutosServiceInterface = Symbol('ProdutosServiceInterface')
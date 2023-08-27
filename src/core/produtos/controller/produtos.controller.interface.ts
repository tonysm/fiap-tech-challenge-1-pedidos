import { CreateProdutoDto } from "src/externals/apis/dto/create-produto.dto"
import { Categoria } from "./../entities/produto.entity"
import { UpdateProdutoDto } from "src/externals/apis/dto/update-produto.dto"

export interface ProdutosControllerInterface {
    create(input: CreateProdutoDto)
    findAll()
    findAllByCategoria(categoria: Categoria)
    findOne(id: number)
    update(id: number, input: UpdateProdutoDto)
    remove(id: number)
}

export const ProdutosControllerInterface = Symbol('ProdutosControllerInterface')
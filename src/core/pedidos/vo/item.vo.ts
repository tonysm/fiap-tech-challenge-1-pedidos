import { Produto } from "src/core/produtos/entities/produto.entity";
import { Item as ItemEntity } from "../entities/item.entity";

export class Item {
    constructor (
        private quantidade: number,
        private produto: Produto,
        private observacao: string,
    ) {}

    toEntity(entity: ItemEntity) {
        entity.quantidade = this.quantidade
        entity.produto = this.produto
        entity.observacao = this.observacao
    }
}

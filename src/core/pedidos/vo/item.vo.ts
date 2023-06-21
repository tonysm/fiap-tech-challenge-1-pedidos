import { Produto } from "src/core/produtos/entities/produto.entity";
import { Item as ItemEntity } from "../entities/item.entity";
import { Entity } from "typeorm";
import { IdentifiableObject } from "src/core/bases/identifiable.object";

export class ItemVO extends IdentifiableObject {
    constructor (
        private quantidade: number,
        private produto: Produto,
        private observacao: string,
        private precoUnitario: number
    ) {
        super()
    }

    toEntity(entity?: ItemEntity): ItemEntity {

        if(entity == null) {
            entity = new ItemEntity()
        }

        entity.quantidade = this.quantidade
        entity.produto = this.produto
        entity.observacao = this.observacao
        entity.precoUnitario = this.precoUnitario
        entity.id = this.id

        return entity
    }
}

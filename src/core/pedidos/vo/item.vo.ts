import { Produto } from "src/core/produtos/entities/produto.entity";
import { Item as ItemEntity } from "../entities/item.entity";
import { IdentifiableObject } from "src/core/bases/identifiable.object";

export class ItemVO extends IdentifiableObject {
    constructor (
        public readonly quantidade: number,
        public readonly produto: Produto,
        public readonly observacao: string,
        public readonly precoUnitario: number,
        id?: number,
    ) {
        super()

        this.id = id;
    }

    toEntity(entity?: ItemEntity): ItemEntity {
        if (entity == null) {
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

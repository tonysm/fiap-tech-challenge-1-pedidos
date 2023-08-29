import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "src/core/pedidos/entities/item.entity";
import { Pedido, Status, StatusPagamento } from "src/core/pedidos/entities/pedido.entity";
import { PedidoNaoEncontrado } from "src/core/pedidos/exceptions/pedido.exception";
import { PedidosRepositoryInterface } from "src/core/pedidos/repositories/pedidos.repository";
import { Repository, getConnection } from "typeorm";

@Injectable()
export class PedidosRepository implements PedidosRepositoryInterface {
    constructor (
        @InjectRepository(Pedido)
        private pedidos: Repository<Pedido>,
        @InjectRepository(Item)
        private itens: Repository<Item>,
    ) {}

    findAll(): Promise<Pedido[]> {
        return this.pedidos.find({ loadEagerRelations: true })
    }

    async findAllParaCozinha(): Promise<Pedido[]> {
        return await this.pedidos.query(
                `
                SELECT 
                *
                FROM pedido p
                WHERE
                    p.status IN ('PRONTO', 'EM_PREPARACAO', 'RECEBIDO')
                    AND p.statusPagamento  = 'SUCESSO'
                ORDER BY
                CASE
                    WHEN p.status = 'PRONTO' THEN 1
                    WHEN p.status = 'EM_PREPARACAO' THEN 2
                    WHEN p.status = 'RECEBIDO' THEN 3
                    else -1
                END, p.dataConfirmacaoPagamento
                `
        )
    }

    async findOneOrFail(id: number): Promise<Pedido> {
        const pedido = await this.pedidos.findOneBy({ id });

        if (! pedido) throw new PedidoNaoEncontrado;

        return pedido;
    }

    findOneItem(id: number): Promise<Item> {
        return this.itens.findOneBy({ id });
    }

    deleteItem(id: number) {
        this.itens.delete({ id })
    }

    save(pedido: Pedido) {
        return this.pedidos.save(pedido);
    }
}

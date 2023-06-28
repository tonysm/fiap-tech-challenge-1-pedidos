import { Item } from "../entities/item.entity";
import { Pedido } from "../entities/pedido.entity";

export interface PedidosRepositoryInterface {
    findAll(): Promise<Pedido[]>;
    findAllParaCozinha(): Promise<Pedido[]>;
    findOneOrFail(id: number): Promise<Pedido>;

    findOneItem(id: number): Promise<Item>;
    deleteItem(id: number);

    save(pedido: Pedido);
}

export const PedidosRepositoryInterface = Symbol('PedidosRepositoryInterface')

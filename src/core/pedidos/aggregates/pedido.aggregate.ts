import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { Item } from "../vo/item.vo";

export class Pedido {
    constructor(
        private items: Item[],
        private cliente?: Cliente,
    ) {}
}

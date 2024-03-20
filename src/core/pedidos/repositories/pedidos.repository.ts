import { Item } from '../entities/item.entity';
import { Pedido } from '../entities/pedido.entity';

export interface PedidosRepositoryInterface {
  findAll(): Promise<Pedido[]>;
  findOneOrFail(id: number): Promise<Pedido>;

  findOneItem(id: number): Promise<Item>;
  deleteItem(id: number): void;

  save(pedido: Pedido): Promise<Pedido>;

  cancelarPedidosPendentes(clienteId: number): void;
}

export const PedidosRepositoryInterface = Symbol('PedidosRepositoryInterface');

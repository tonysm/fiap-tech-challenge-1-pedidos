import { PedidoAggregate } from '../pedidos/aggregates/pedido.aggregate';

export interface PagamentoGateway {
  checkout(pedido: PedidoAggregate): Promise<void>;
}

export const PagamentoGateway = Symbol('PagamentoGateway');

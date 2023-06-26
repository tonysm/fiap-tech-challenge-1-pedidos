import { PedidoAggregate } from "../pedidos/aggregates/pedido.aggregate";

export interface PaymentGateway {
  checkout(pedido: PedidoAggregate): Promise<void>;
}

export const PaymentGateway = Symbol('PaymentGateway')

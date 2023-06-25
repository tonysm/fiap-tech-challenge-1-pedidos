import { Injectable } from "@nestjs/common";
import { PedidoAggregate } from "../pedidos/aggregates/pedido.aggregate";
import { PaymentGateway } from "./payment.gateway";

@Injectable()
export class FakePaymentGateway implements PaymentGateway {
  async checkout(pedido: PedidoAggregate) {
   // Pagamento Fake...
  }
}

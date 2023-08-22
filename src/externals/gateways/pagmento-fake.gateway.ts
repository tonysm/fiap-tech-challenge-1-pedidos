import { Injectable } from "@nestjs/common";
import { PedidoAggregate } from "../../core/pedidos/aggregates/pedido.aggregate";
import { PagamentoGateway } from "../../core/pagamentos/pagamento.gateway";

@Injectable()
export class PagamentoFakeGateway implements PagamentoGateway {
  async checkout(pedido: PedidoAggregate) {
   // Pagamento Fake...
  }
}

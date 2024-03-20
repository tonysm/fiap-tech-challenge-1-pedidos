import { Inject, Injectable } from "@nestjs/common";
import { PubSubService } from "./pubsub.service";
import { ConfirmaPagamentoDoPedidoDto, ResultadoPagamento } from "../apis/dto/confirma-pagamento-do-pedido.dto";
import { PedidosServiceInterface } from "src/core/pedidos/pedido.service.interface";
import { PedidosService } from "src/core/pedidos/pedidos.service";

@Injectable()
export class ConfirmarPagamentoChannel {
    constructor(
        @Inject(PubSubService)
        private readonly pubSubService: PubSubService,
        @Inject(PedidosService)
        private readonly pedidos: PedidosServiceInterface,
    ) {}

    async registerMessageConsumer() {
        await this.pubSubService.consumeMessages(
            "confirmar-pagamento-topic",
            "confirmar-pagamento-topic.pedidos-subscription",
            async (message) => {
              const input: ConfirmaPagamentoDoPedidoDto = JSON.parse(message)
              await this.pedidos.confirmarPagamento(
                input.pedido,
                input.resultadoPagamento === ResultadoPagamento.SUCESSO,
              )
            }
        )
    }

}

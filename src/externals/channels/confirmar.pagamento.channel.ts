import { Inject, Injectable } from "@nestjs/common";
import { PubSubService } from "./pubsub.service";
import { PedidosController } from "src/core/pedidos/controller/pedidos.controller";
import { PedidosControllerInterface } from "src/core/pedidos/controller/pedidos.controller.interface";
import { ConfirmaPagamentoDoPedidoDto, ResultadoPagamento } from "../apis/dto/confirma-pagamento-do-pedido.dto";

@Injectable()
export class ConfirmarPagamentoChannel {

    constructor(
        @Inject(PubSubService)
        private readonly pubSubService: PubSubService,
        @Inject(PedidosController)
        private readonly pedidos: PedidosControllerInterface,
    ) {}

    async registerMessageConsumer() {
        await this.pubSubService.consumeMessages(
            "confirmar-pagamento-topic",
            "confirmar-pagamento-topic.pedidos-subscription",
            (message) => {
              const input: ConfirmaPagamentoDoPedidoDto = JSON.parse(message)
              this.pedidos.confirmaPagamento(
                input.pedido,
                input.resultadoPagamento === ResultadoPagamento.SUCESSO,
              )
            }
        )
    }

}
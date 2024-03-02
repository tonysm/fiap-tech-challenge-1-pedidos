import { Inject, Injectable } from "@nestjs/common";
import { PubSubService } from "./pubsub.service";

@Injectable()
export class ConfirmarPagamentoChannel {

    constructor(
        @Inject(PubSubService)
        private readonly pubSubService: PubSubService
    ) {}

    solicitarPagamento(pedidoId: number, valorTotal: number) {
        this.pubSubService.publishMessage("solicitar-pagamento-topic", {
          pedidoId: pedidoId,
          valorTotal: valorTotal
        })
    }

    async registerMessageConsumer() {
        await this.pubSubService.consumeMessages(
            "confirmar-pagamento-topic",
            "confirmar-pagamento-topic.pedidos-subscription",
            (message) => {
              console.log(`messagem recebida PERSONALIZADA: ${message}`)
            }
        )
    }

}
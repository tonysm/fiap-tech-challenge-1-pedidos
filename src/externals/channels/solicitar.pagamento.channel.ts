import { Inject, Injectable } from "@nestjs/common";
import { PubSubService } from "./pubsub.service";

@Injectable()
export class SolicitarPagamentoChannel {
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
}

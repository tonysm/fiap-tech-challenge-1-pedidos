import { Inject, Injectable } from "@nestjs/common";
import { PubSubService } from "./pubsub.service";
import { PedidosServiceInterface } from "src/core/pedidos/pedido.service.interface";
import { PedidosService } from "src/core/pedidos/pedidos.service";
import { FinalizarPedidoDto } from "../apis/dto/finalizar-pedido.dto";

@Injectable()
export class FinalizarPedidoChannel {
    constructor(
        @Inject(PubSubService)
        private readonly pubSubService: PubSubService,
        @Inject(PedidosService)
        private readonly pedidos: PedidosServiceInterface,
    ) {}

    async registerMessageConsumer() {
        await this.pubSubService.consumeMessages(
            "concluir-pedido-topic",
            "concluir-pedido-topic.pedido-subscription",
            async (message) => {
              const input: FinalizarPedidoDto = JSON.parse(message)
              await this.pedidos.finalizar(input.pedido)
            }
        )
    }

}

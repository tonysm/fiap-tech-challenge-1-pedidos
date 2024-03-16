import { Inject, Injectable } from "@nestjs/common";
import { PubSubService } from "./pubsub.service";
import { Pedido } from "src/core/pedidos/entities/pedido.entity";

export class ItemProducao {
    static fromItensDoPedido(pedido: Pedido) {
        return pedido.itens.map(item => {
            return new ItemProducao(
                item.produto.nome,
                item.observacao,
                item.quantidade,
            );
        })
    }

    constructor(
        public readonly nome: string,
        public readonly observacao: string,
        public readonly quantidade: number,
    ) {}
}

export class PedidoProducaoDTO {
    static fromEntity(pedido: Pedido) {
        return new PedidoProducaoDTO(
            pedido.id,
            ItemProducao.fromItensDoPedido(pedido),
        )
    }

    constructor(
        public readonly pedidoId: number,
        public readonly itens: ItemProducao[],
    ) {}

    toPayload() {
        return {
            num_pedido: this.pedidoId,
            itens_attributes: this.itens,
        }
    }
}

@Injectable()
export class PrepararPedidoChannel {
    constructor(
        @Inject(PubSubService)
        private readonly pubSubService: PubSubService
    ) {}

    prepararPedido(pedido: PedidoProducaoDTO) {
        this.pubSubService.publishMessage("solicitar-preparo-topic", pedido.toPayload())
    }
}

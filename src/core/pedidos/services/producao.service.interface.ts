import { Pedido } from "../entities/pedido.entity";

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

export interface ProducaoServiceInterface {
    iniciarProducao(pedidoProducaoDTO: PedidoProducaoDTO);
}

export const ProducaoServiceInterface = Symbol('ProducaoServiceInterface');

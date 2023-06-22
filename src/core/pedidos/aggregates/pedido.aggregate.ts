import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { ItemVO } from "../vo/item.vo";
import { Pedido, Status } from "../entities/pedido.entity";
import { IdentifiableObject } from "src/core/bases/identifiable.object";
import { StatusInvalidoParaFinalizado, StatusInvalidoParaIniciarPreparacao, StatusInvalidoParaPronto } from "../exceptions/pedido.exception";

export class PedidoAggregate extends IdentifiableObject {

    constructor(
        private status: Status,
        private items: ItemVO[],
        private cliente?: Cliente,
    ) {
        super()
    }

    iniciarPreparacaoDoPedido() {
        if(this.status != Status.RECEBIDO) {
            throw new StatusInvalidoParaIniciarPreparacao
        }

        this.status = Status.EM_PREPARACAO
    }

    encerrarPreparacaoDoPedido() {
        if(this.status != Status.EM_PREPARACAO) {
            throw new StatusInvalidoParaPronto
        }

        this.status = Status.PRONTO
    }

    finalizarPedido() {
        if(this.status != Status.PRONTO) {
            throw new StatusInvalidoParaFinalizado
        }

        this.status = Status.FINALIZADO
    }

    async toEntity(): Promise<Pedido> {
        const items = await Promise.all(this.items.map(element => {
            return element.toEntity()
        }))

        const pedido = new Pedido()
        pedido.id = this.id
        pedido.cliente = this.cliente
        pedido.items = items
        pedido.status = this.status

        return pedido
    }
}

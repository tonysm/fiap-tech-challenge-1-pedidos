import { HttpException, HttpStatus } from "@nestjs/common";

export class PedidoException extends HttpException {}

export class StatusInvalidoParaIniciarPreparacao extends PedidoException {
    constructor () {
        super('Pedido deve estar estar como recebido para iniciar a preparação', HttpStatus.BAD_REQUEST)
    }
}

export class StatusInvalidoParaPronto extends PedidoException {
    constructor () {
        super('Pedido deve estar sendo preparado para ser marcado como pronto', HttpStatus.BAD_REQUEST)
    }
}

export class StatusInvalidoParaFinalizado extends PedidoException {
    constructor () {
        super('Pedido deve estar pronto para ser finalizado', HttpStatus.BAD_REQUEST)
    }
}

export class PedidoNaoEncontrado extends PedidoException {
    constructor() {
        super('Pedido não encontrado', HttpStatus.NOT_FOUND)
    }
}
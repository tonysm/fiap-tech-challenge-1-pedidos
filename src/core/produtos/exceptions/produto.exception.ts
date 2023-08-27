import { HttpException, HttpStatus } from "@nestjs/common";

export class ProdutoException extends HttpException {}

export class ProdutoNaoEncontrado extends ProdutoException {
    constructor () {
        super('Produto não encontrado', HttpStatus.NOT_FOUND)
    }
}

export class ItemNaoEncontrado extends ProdutoException {
    constructor () {
        super('Item não encontrado', HttpStatus.NOT_FOUND)
    }
}
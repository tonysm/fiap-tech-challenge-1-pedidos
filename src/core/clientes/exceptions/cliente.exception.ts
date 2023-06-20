import { HttpException, HttpStatus } from "@nestjs/common";

export class ClienteException extends HttpException {}

export class ClienteNaoEncontrado extends ClienteException {
    constructor () {
        super('Cliente não encontrado', HttpStatus.NOT_FOUND)
    }
}

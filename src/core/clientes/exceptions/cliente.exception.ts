import { HttpException, HttpStatus } from "@nestjs/common";

export class ClienteException extends HttpException {}

export class ClienteNaoEncontrado extends ClienteException {
    constructor () {
        super('Cliente não encontrado', HttpStatus.NOT_FOUND)
    }
}

export class DuplicidadeDeCpf extends ClienteException {
    constructor () {
        super({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'Ocorreu um erro.',
            message: ['Já existe um cadastro para o CPF informado'],
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
}

export class DuplicidadeDeEmail extends ClienteException {
    constructor () {
        super({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'Ocorreu um erro.',
            message: ['Email já cadastrado'],
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
}

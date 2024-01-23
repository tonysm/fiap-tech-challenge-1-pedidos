import { HttpException, HttpStatus } from "@nestjs/common";

export class ServiceException extends HttpException {}

export class ProducaoServiceIndisponivelException extends ServiceException {
    constructor() {
        super({
            status: HttpStatus.BAD_REQUEST,
            message: 'Serviço de produção indisponível no momento.',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
}

export class PagamentoServiceIndisponivelException extends ServiceException {
    constructor() {
        super({
            status: HttpStatus.BAD_REQUEST,
            message: 'Serviço de pagamento indisponível no momento.',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
}

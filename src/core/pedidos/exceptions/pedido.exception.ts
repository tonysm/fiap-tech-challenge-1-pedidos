import { HttpException, HttpStatus } from '@nestjs/common';
import { Pedido } from '../entities/pedido.entity';

export class PedidoException extends HttpException { }

export class StatusInvalidoParaIniciarPreparacao extends PedidoException {
  constructor() {
    super(
      'Pedido deve estar estar como recebido para iniciar a preparação',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class StatusDoPagamentoInvalidoParaIniciarPreparacao extends PedidoException {
  constructor() {
    super(
      'Pedido deve ter sido pago para iniciar a preparação',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class StatusInvalidoParaPronto extends PedidoException {
  constructor() {
    super(
      'Pedido deve estar sendo preparado para ser marcado como pronto',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class StatusInvalidoParaFinalizado extends PedidoException {
  constructor() {
    super(
      'Pedido deve estar pronto para ser finalizado',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class StatusInvalidoException extends PedidoException {
  constructor() {
    super('Status desconhecido', HttpStatus.BAD_REQUEST);
  }
}

export class PedidoNaoEncontrado extends PedidoException {
  constructor() {
    super('Pedido não encontrado', HttpStatus.NOT_FOUND);
  }
}

export class NaoPodeAlterarPedido extends PedidoException {
  constructor() {
    super('Pedido não pode ser alterado', HttpStatus.BAD_REQUEST);
  }
}

export class PedidoEmEtapaInvalidaParaRealizarOperacao extends PedidoException {
  constructor() {
    super(
      'Não é permitido realizar essa operação na etapa atual do pedido',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PedidoSemItens extends PedidoException {
  constructor() {
    super('Pedido sem itens.', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class PagamentoFalhou extends PedidoException {
  constructor(pedido: Pedido) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message: 'Falha no pagamento',
        pedido,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class NaoPodeSolicitarPagamento extends PedidoException {
    constructor(pedido: Pedido) {
        super({
            status: HttpStatus.BAD_REQUEST,
            message: 'Não pode solicitar pagamento de pedido.',
            pedido,
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
}

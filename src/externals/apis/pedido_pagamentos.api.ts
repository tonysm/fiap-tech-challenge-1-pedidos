import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PedidosController } from "src/core/pedidos/controller/pedidos.controller";
import { PedidosControllerInterface } from "src/core/pedidos/controller/pedidos.controller.interface";
import { ConfirmaPagamentoDoPedidoDto, ResultadoPagamento } from "./dto/confirma-pagamento-do-pedido.dto";

@Controller('pedidos/:pedido')
@ApiTags('pedidos')
export class PedidoPagamentosAPI {
  constructor(
    @Inject(PedidosController)
    private readonly pedidos: PedidosControllerInterface,
  ) {}

  @ApiOperation({ summary: 'Solicitar pagamento' })
  @Post('solicitar-pagamento')
  async solicitarPagamento(
    @Param('pedido') pedido: number,
  ) {
    return this.pedidos.solicitarPagamento(pedido)
  }

  @ApiOperation({ summary: 'Confirmar pagamento (chamado pelo serviço de pagamentos)' })
  @Post('confirmar-pagamento')
  async confirmarPagamento(
    @Param('pedido') pedido: number,
    @Body() input: ConfirmaPagamentoDoPedidoDto,
  ) {
    return this.pedidos.confirmaPagamento(
        pedido,
        input.resultadoPagamento === ResultadoPagamento.SUCESSO,
    )
  }
}

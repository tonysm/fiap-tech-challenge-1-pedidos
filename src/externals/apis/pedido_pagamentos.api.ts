import { Controller, Inject, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PedidosController } from "src/core/pedidos/controller/pedidos.controller";
import { PedidosControllerInterface } from "src/core/pedidos/controller/pedidos.controller.interface";

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
}

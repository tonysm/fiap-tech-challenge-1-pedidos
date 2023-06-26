import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfirmaPedidoDto } from "./dto/confirma-pedido.dto";
import { PaymentGateway } from "src/core/payments/payment.gateway";
import { PedidosService } from "src/core/pedidos/pedidos.service";

@Controller('pedidos/:id/confirm')
@ApiTags('pedidos')
export class PedidosConfirmadosController {
  constructor (
    private pedidos: PedidosService,
    @Inject(PaymentGateway)
    private payments: PaymentGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: "Confirma o pagamento" })
  create(@Param('id') pedidoId: number, @Body() input: ConfirmaPedidoDto) {
    return this.pedidos.confirmaPagamento(pedidoId, this.payments);
  }
}

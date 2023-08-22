import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfirmaPedidoDto } from "./dto/confirma-pedido.dto";
import { PagamentoGateway } from "src/core/pagamentos/pagamento.gateway";
import { PedidosService } from "src/core/pedidos/pedidos.service";
import { PagamentoFakeGateway } from "src/externals/gateways/pagmento-fake.gateway";

@Controller('pedidos/:id/confirm')
@ApiTags('pedidos')
export class PedidosConfirmadosController {
  constructor (
    private pedidos: PedidosService,
    @Inject(PagamentoFakeGateway)
    private pagamento: PagamentoGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: "Confirma o pagamento" })
  create(@Param('id') pedidoId: number, @Body() input: ConfirmaPedidoDto) {
    return this.pedidos.confirmaPagamento(pedidoId, this.pagamento);
  }
}

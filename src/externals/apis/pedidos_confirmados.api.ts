import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfirmaPedidoDto } from "./dto/confirma-pedido.dto";
import { PagamentoGateway } from "src/core/pagamentos/pagamento.gateway";
import { PagamentoFakeGateway } from "src/externals/gateways/pagmento-fake.gateway";
import { PedidosController } from "src/core/pedidos/controller/pedidos.controller";
import { PedidosControllerInterface } from "src/core/pedidos/controller/pedidos.controller.interface";

@Controller('pedidos/:id/confirm')
@ApiTags('pedidos')
export class PedidosConfirmadosAPI {
  constructor (
    @Inject(PedidosController)
    private pedidos: PedidosControllerInterface,
    @Inject(PagamentoFakeGateway)
    private pagamento: PagamentoGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: "Confirma o pagamento" })
  create(@Param('id') pedidoId: number, @Body() input: ConfirmaPedidoDto) {
    return this.pedidos.confirmaPagamento(pedidoId, this.pagamento);
  }
}

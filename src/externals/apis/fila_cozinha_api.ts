import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PedidosService } from "src/core/pedidos/pedidos.service";
import { UpdateEtapaPedido } from "./dto/update-etapa-pedido.dto";

@Controller('cozinha/pedidos')
@ApiTags('cozinha')
export class FilaCozinhaController {
  constructor (
    private pedidos: PedidosService,
  ) {}

  @ApiOperation({ summary: 'Lista os pedidos para acompanhamento via painel' })
  @Get()
  index() {
    return this.pedidos.findAllParaCozinha()
  }

  @Put(":id/status")
  @ApiOperation({ summary: 'Atualiza a etapa do pedido' })
  @ApiResponse({ status: 200  })
  async atualizaStatus(@Param('id') id: number, @Body() input: UpdateEtapaPedido) {
    return this.pedidos.atualizaStatusDoPedido(id, input.status);
  }
}

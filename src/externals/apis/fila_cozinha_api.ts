import { Body, Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateEtapaPedido } from './dto/update-etapa-pedido.dto';
import { PedidosControllerInterface } from 'src/core/pedidos/controller/pedidos.controller.interface';
import { PedidosController } from 'src/core/pedidos/controller/pedidos.controller';

@Controller('cozinha/pedidos')
@ApiTags('cozinha')
export class FilaCozinhaAPI {
  constructor(
    @Inject(PedidosController)
    private pedidos: PedidosControllerInterface,
  ) {}

  @ApiOperation({ summary: 'Lista os pedidos para acompanhamento via painel' })
  @Get()
  index() {
    return this.pedidos.findAllParaCozinha();
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Atualiza a etapa do pedido' })
  @ApiResponse({ status: 200 })
  async atualizaStatus(
    @Param('id') id: number,
    @Body() input: UpdateEtapaPedido,
  ) {
    return this.pedidos.atualizaStatusDoPedido(id, input.status);
  }
}

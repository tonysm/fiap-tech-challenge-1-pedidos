import { Controller, Inject, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PedidosController } from "src/core/pedidos/controller/pedidos.controller";
import { PedidosControllerInterface } from "src/core/pedidos/controller/pedidos.controller.interface";

@Controller('pedidos/:pedido/finalizar')
@ApiTags('pedidos')
export class PedidosFinalizadosAPI {
  constructor(
    @Inject(PedidosController)
    private readonly pedidos: PedidosControllerInterface,
  ) {}

  @ApiOperation({ summary: 'Marca um pedido como funalizado (chamado pelo serviço de produção)' })
  @Post()
  async create(
    @Param('pedido') pedido: number,
  ) {
    return this.pedidos.finalizar(pedido)
  }
}

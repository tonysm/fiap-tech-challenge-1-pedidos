import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pedido } from '../../../core/pedidos/entities/pedido.entity';
import { PedidosService } from '../../../core/pedidos/pedidos.service';
import { CreatePedidoDto } from '../../../core/pedidos/dto/create-pedido.dto';

@Controller('pedidos')
@ApiTags('pedidos')
export class PedidosController {
    constructor(
      private readonly pedidosService: PedidosService
    ) {}

    @Get()
    @ApiOperation({ summary: "Lista os pedidos" })
    @ApiResponse({
        status: 200,
        description: 'Lista de pedidos',
        type: Array<Pedido>,
    })
    index() {
        return this.pedidosService.findAll()
    }

    @Post()
    @ApiOperation({ summary: 'Cria pedido' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 200, type: Pedido })
    async create(@Body() input: CreatePedidoDto) {
      return this.pedidosService.create(input);
    }

    @Put("iniciar-preparacao/:id")
    @ApiOperation({ summary: 'Atualiza a etapa do pedido para em preparação' })
    @ApiResponse({ status: 200  })
    async iniciarPreparacaoDoPedido(@Param('id') id: number) {
      return this.pedidosService.iniciarPreparacaoDoPedido(id)
    }


    @Put("encerrar-preparacao/:id")
    @ApiOperation({ summary: 'Atualiza a etapa do pedido para pronto' })
    @ApiResponse({ status: 200 })
    async encerrarPreparacaoDoPedido(@Param('id') id: number) {
      return this.pedidosService.encerrarPreparacaoDoPedido(id)
    }

    @Put("finalizar/:id")
    @ApiOperation({ summary: 'Atualiza a etapa do pedido para finalizado' })
    @ApiResponse({ status: 200 })
    async finalizarPedido(@Param('id') id: number) {
      return this.pedidosService.finalizarPedido(id)
    }

}

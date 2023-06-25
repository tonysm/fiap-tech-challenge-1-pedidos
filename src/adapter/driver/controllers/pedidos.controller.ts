import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pedido } from '../../../core/pedidos/entities/pedido.entity';
import { PedidosService } from '../../../core/pedidos/pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
@ApiTags('pedidos')
export class PedidosController {
    constructor(
      private readonly pedidosService: PedidosService,
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

    @Get(':id')
    show(@Param('id') id: number) {
      return this.pedidosService.findOne(id);
    }
}

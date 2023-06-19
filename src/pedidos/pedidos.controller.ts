import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pedido } from './entities/pedido.entity';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
@ApiTags('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) {}

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
}

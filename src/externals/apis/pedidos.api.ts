import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pedido } from '../../core/pedidos/entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidosServiceInterface } from 'src/core/pedidos/pedido.service.interface';

@Controller('pedidos')
@ApiTags('pedidos')
export class PedidosController {
    constructor(
      @Inject(PedidosServiceInterface)
      private readonly pedidosService: PedidosServiceInterface,
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
    @ApiOperation({ summary: 'Inicia pedido' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 200, type: Pedido })
    async create(@Body() input: CreatePedidoDto) {
      return this.pedidosService.create(input);
    }

    @ApiOperation({ summary: 'Busca pedido por id' })
    @Get(':id')
    show(@Param('id') id: number) {
      return this.pedidosService.findOne(id);
    }
}

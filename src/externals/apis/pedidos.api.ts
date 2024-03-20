import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pedido } from '../../core/pedidos/entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidosController } from 'src/core/pedidos/controller/pedidos.controller';
import { PedidosControllerInterface } from 'src/core/pedidos/controller/pedidos.controller.interface';

@Controller('pedidos')
@ApiTags('pedidos')
export class PedidosAPI {
  constructor(
    @Inject(PedidosController)
    private readonly pedidosController: PedidosControllerInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista os pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos',
    type: Array<Pedido>,
  })
  index() {
    return this.pedidosController.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Inicia pedido' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, type: Pedido })
  async create(@Body() input: CreatePedidoDto) {
    return this.pedidosController.create(input);
  }

  @ApiOperation({ summary: 'Busca pedido por id' })
  @Get(':id')
  show(@Param('id') id: number) {
    return this.pedidosController.findOne(id);
  }
}

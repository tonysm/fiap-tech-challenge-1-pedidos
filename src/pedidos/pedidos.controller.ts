import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Pedido } from './entities/pedido.entity';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
export class PedidosController {
    constructor(private readonly catsService: PedidosService) {}

    @Get()
    @ApiOperation({ summary: "Lista os pedidos" })
    @ApiResponse({
        status: 200,
        description: 'Lista de pedidos',
        type: Array<Pedido>,
    })
    index(): Promise<Array<Pedido>> {
        return new Promise((resolve) => {
            let pedido = new Pedido();
            pedido.id = 123;

            resolve([
                pedido,
            ]);
        })
    }

    @Post()
    @ApiOperation({ summary: 'Cria pedido' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 200, type: Pedido })
    async create(@Body() createCatDto: CreatePedidoDto): Promise<Pedido> {
      return this.catsService.create(createCatDto);
    }
}

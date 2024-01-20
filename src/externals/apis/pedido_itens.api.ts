import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Inject,
} from '@nestjs/common';

import { CreatePedidoItemDto } from './dto/create-pedido-item.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProdutosService } from 'src/core/produtos/produtos.service';
import { ProdutoNaoEncontrado } from 'src/core/produtos/exceptions/produto.exception';
import { ItemVO } from 'src/core/pedidos/vo/item.vo';
import { UpdatePedidoItemDto } from './dto/update-pedido-item.dto';
import { PedidosControllerInterface } from 'src/core/pedidos/controller/pedidos.controller.interface';
import { PedidosController } from 'src/core/pedidos/controller/pedidos.controller';

@Controller('pedidos/:pedido/itens')
@ApiTags('pedidos')
export class PedidoItensAPI {
  constructor(
    @Inject(PedidosController)
    private readonly pedidos: PedidosControllerInterface,
    private readonly produtos: ProdutosService,
  ) {}

  @ApiOperation({ summary: 'Adiciona item ao pedido' })
  @Post()
  async create(
    @Param('pedido') pedido: number,
    @Body() input: CreatePedidoItemDto,
  ) {
    const produto = await this.findProdutoOrFail(input.produtoId);

    return this.pedidos.addItem(
      pedido,
      new ItemVO(
        input.quantidade,
        produto,
        input.observacao,
        produto.precoUnitario,
      ),
    );
  }

  @ApiOperation({ summary: 'Atualiza item do pedido' })
  @Patch(':id')
  async update(
    @Param('pedido') pedidoId: number,
    @Param('id') itemId: number,
    @Body() input: UpdatePedidoItemDto,
  ) {
    return this.pedidos.updateItem(pedidoId, itemId, input);
  }

  @ApiOperation({ summary: 'Remove item do pedido' })
  @Delete(':id')
  remove(@Param('pedido') pedidoId: number, @Param('id') itemId: number) {
    return this.pedidos.removeItem(pedidoId, itemId);
  }

  private async findProdutoOrFail(id: number) {
    const produto = await this.produtos.findOne(id);

    if (!produto) throw new ProdutoNaoEncontrado();

    return produto;
  }
}

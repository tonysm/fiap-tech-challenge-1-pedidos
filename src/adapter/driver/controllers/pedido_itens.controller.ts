import { Controller, Post, Body, Param, Delete, Patch } from '@nestjs/common';

import { CreatePedidoItemDto } from './dto/create-pedido-item.dto';
import { PedidosService } from 'src/core/pedidos/pedidos.service';
import { ApiTags } from '@nestjs/swagger';
import { ProdutosService } from 'src/core/produtos/produtos.service';
import { ProdutoNaoEncontrado } from 'src/core/produtos/exceptions/produto.exception';
import { ItemVO } from 'src/core/pedidos/vo/item.vo';
import { UpdatePedidoItemDto } from './dto/update-pedido-item.dto';

@Controller('pedidos/:pedido/itens')
@ApiTags('pedidos')
export class PedidoItensController {
  constructor(
    private readonly service: PedidosService,
    private readonly produtos: ProdutosService,
  ) {}

  @Post()
  async create(@Param('pedido') pedido: number, @Body() input: CreatePedidoItemDto) {
    const produto = await this.findProdutoOrFail(input.produtoId);

    return this.service.addItem(pedido, new ItemVO(
      input.quantidade,
      produto,
      input.observacao,
      produto.precoUnitario
    ));
  }

  @Patch(':id')
  async update(@Param('pedido') pedidoId: number, @Param('id') itemId: number, @Body() input: UpdatePedidoItemDto) {
    return this.service.updateItem(pedidoId, itemId, input);
  }

  @Delete(':id')
  remove(@Param('pedido') pedidoId: number, @Param('id') itemId: number) {
    return this.service.removeItem(pedidoId, itemId);
  }

  private async findProdutoOrFail(id: number) {
    const produto = await this.produtos.findOne(id)

    if ( ! produto) throw new ProdutoNaoEncontrado

    return produto;
  }
}

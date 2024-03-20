import { PedidosController } from 'src/core/pedidos/controller/pedidos.controller';
import { ProdutosService } from 'src/core/produtos/produtos.service';
import { PedidoItensAPI } from './pedido_itens.api';
import { PedidosControllerInterface } from 'src/core/pedidos/controller/pedidos.controller.interface';
import { Produto } from 'src/core/produtos/entities/produto.entity';
import { CreatePedidoItemDto } from './dto/create-pedido-item.dto';
import { Pedido } from 'src/core/pedidos/entities/pedido.entity';
import { UpdatePedidoItemDto } from './dto/update-pedido-item.dto';
import { Item } from 'src/core/pedidos/entities/item.entity';
import { ProdutoNaoEncontrado } from 'src/core/produtos/exceptions/produto.exception';

describe('PedidoItensAPI', () => {
  let controller: PedidosControllerInterface;
  let service: ProdutosService;
  let api: PedidoItensAPI;

  beforeEach(() => {
    controller = new PedidosController(null, null, null);
    service = new ProdutosService(null);
    api = new PedidoItensAPI(controller, service);
  });

  it('creates', async () => {
    let produto = new Produto();
    produto.id = 1;

    let pedido = new Pedido();
    pedido.id = 2;

    let body = new CreatePedidoItemDto();
    body.produtoId = produto.id;
    body.quantidade = 2;
    body.observacao = 'lorem ipsum';

    let usedId;
    jest.spyOn(service, 'findOne').mockImplementation(async (id) => {
      usedId = id;
      return produto;
    });

    let usedPedido, usedItem;

    jest
      .spyOn(controller, 'addItem')
      .mockImplementation(async (aPedido, aItem) => {
        usedPedido = aPedido;
        usedItem = aItem;

        return pedido;
      });

    const result = await api.create(pedido.id, body);

    expect(result).toBe(pedido);
    expect(usedId).toBe(produto.id);
    expect(usedPedido).toBe(pedido.id);
    expect(usedItem.quantidade).toBe(body.quantidade);
    expect(usedItem.observacao).toBe(body.observacao);
    expect(usedItem.produto).toBe(produto);
  });

  it('fails to create when produto not found', async () => {
    let body = new CreatePedidoItemDto();
    body.produtoId = 1;
    body.quantidade = 2;
    body.observacao = 'lorem ipsum';

    jest.spyOn(service, 'findOne').mockImplementation(async () => null);

    try {
      await api.create(3, body);
      fail('should have failed');
    } catch (error) {
      expect(error).toBeInstanceOf(ProdutoNaoEncontrado);
    }
  });

  it('updates itens', async () => {
    let pedido = new Pedido();
    pedido.id = 1;

    let item = new Item();
    item.id = 2;

    let input = new UpdatePedidoItemDto();

    let usedPedidoId, usedItemId, usedInput;
    jest
      .spyOn(controller, 'updateItem')
      .mockImplementation(async (pedidoId, itemId, input) => {
        usedPedidoId = pedidoId;
        usedItemId = itemId;
        usedInput = input;

        return pedido;
      });

    const updated = await api.update(pedido.id, item.id, input);

    expect(updated).toBe(pedido);
    expect(usedPedidoId).toEqual(pedido.id);
    expect(usedItemId).toEqual(item.id);
    expect(usedInput).toEqual(input);
  });

  it('remove item', async () => {
    let pedido = new Pedido();
    pedido.id = 1;

    let item = new Item();
    item.id = 2;

    let usedPedidoId, usedItemId;
    jest
      .spyOn(controller, 'removeItem')
      .mockImplementation(async (pedidoId, itemId) => {
        usedPedidoId = pedidoId;
        usedItemId = itemId;

        return pedido;
      });

    const updated = await api.remove(pedido.id, item.id);

    expect(updated).toBe(pedido);
    expect(usedPedidoId).toEqual(pedido.id);
    expect(usedItemId).toEqual(item.id);
  });
});

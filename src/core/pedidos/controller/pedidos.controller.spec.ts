import { PedidosRepository } from 'src/externals/repositories/pedidos.repository';
import { PedidosRepositoryInterface } from '../repositories/pedidos.repository';
import { PedidosControllerInterface } from './pedidos.controller.interface';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from '../pedidos.service';
import { Pedido, Status, StatusPagamento } from '../entities/pedido.entity';
import { ItemVO } from '../vo/item.vo';
import { Produto } from 'src/core/produtos/entities/produto.entity';
import { Item } from '../entities/item.entity';
import { ClientesService } from 'src/core/clientes/clientes.service';
import { UpdatePedidoItemDto } from 'src/externals/apis/dto/update-pedido-item.dto';
import { v1 } from 'uuid';

describe('PedidosController', () => {
  let repository: PedidosRepositoryInterface;
  let controller: PedidosControllerInterface;
  let clientesService: ClientesService;
  let pedidosService: PedidosService;

  const createItem = (data: object): Item => {
    const item = new Item();

    for (let key in data) {
      item[key] = data[key];
    }

    return item;
  };

  beforeEach(() => {
    controller = new PedidosController(
      (repository = new PedidosRepository(null, null)),
      (pedidosService = new PedidosService(null, null, null, null)),
      (clientesService = new ClientesService(null)),
    );
  });

  it('finds all', async () => {
    const all = [new Pedido()];

    jest
      .spyOn(pedidosService, 'findAll')
      .mockImplementation(async () => Promise.resolve(all));

    const found = await controller.findAll();

    expect(found).toBe(all);
  });

  it('finds one', async () => {
    const pedido = new Pedido();

    let queriedId;
    jest.spyOn(pedidosService, 'findOne').mockImplementation(async (id) => {
      queriedId = id;
      return Promise.resolve(pedido);
    });

    const found = await controller.findOne(123);

    expect(queriedId).toBe(123);
    expect(found).toBe(pedido);
  });

  it('creates', async () => {
    const pedido = new Pedido();
    const clienteId = 123;

    let usedId;
    let usedInput;

    jest.spyOn(clientesService, 'isActive').mockImplementation(async (id) => {
      usedId = id;
      return Promise.resolve(true);
    });

    jest.spyOn(pedidosService, 'create').mockImplementation(async (input) => {
      usedInput = input;
      return Promise.resolve(pedido);
    });

    jest.spyOn(repository, 'save').mockImplementation(async () => {
      return Promise.resolve(pedido);
    });

    const saved = await controller.create({
      clienteId: clienteId,
    });

    expect(saved).toBe(pedido);
  });

  it('adds item', async () => {
    const pedido = new Pedido();
    pedido.id = 123;
    const input = new ItemVO(1, new Produto(), 'lorem', 1);

    let usedId;
    let usedInput;
    jest
      .spyOn(pedidosService, 'addItem')
      .mockImplementation(async (id, input) => {
        usedId = id;
        usedInput = input;
        return Promise.resolve(pedido);
      });

    jest
      .spyOn(repository, 'save')
      .mockImplementation(async () => Promise.resolve(pedido));

    const updated = await controller.addItem(pedido.id, input);

    expect(updated).toBe(pedido);
    expect(usedId).toEqual(pedido.id);
    expect(usedInput).toBe(input);
  });

  it('updates items', async () => {
    const pedido = new Pedido();
    pedido.id = 123;
    const itemId = 234;

    const input = new UpdatePedidoItemDto();
    input.quantidade = 1;
    input.observacao = 'lorem';

    let updatedPedidoId, updatedItemId, updatedInput;

    jest
      .spyOn(pedidosService, 'updateItem')
      .mockImplementation(async (givenPedido, givenItem, givenInput) => {
        updatedPedidoId = givenPedido;
        updatedItemId = givenItem;
        updatedInput = givenInput;
        return Promise.resolve(pedido);
      });

    jest.spyOn(repository, 'save').mockImplementation(async () => Promise.resolve(pedido));

    const updated = await controller.updateItem(pedido.id, itemId, input);

    expect(updated).toBe(pedido);
    expect(updatedPedidoId).toEqual(pedido.id);
    expect(updatedItemId).toEqual(itemId);
    expect(updatedInput).toBe(input);
  });

  it('finds one item', async () => {
    const item = createItem({
      id: 12,
      produto: new Produto(),
      observacao: 'test',
      quantidade: 1,
    });

    let queriedId;
    jest.spyOn(pedidosService, 'findOneItem').mockImplementation(async (id) => {
      queriedId = id;
      return item;
    });

    const found = await controller.findOneItem(item.id);

    expect(queriedId).toEqual(item.id);
    expect(found).toBe(item);
  });

  it('removes item', async () => {
    const pedido = new Pedido();
    pedido.id = 321;
    const itemId = 123;

    jest.spyOn(pedidosService, 'removeItem').mockImplementation(async () => {
      return Promise.resolve(pedido);
    });

    const updated = await controller.removeItem(pedido.id, itemId);

    expect(updated).toBe(pedido);
  });

  it('requests payment', async () => {
    const pedido = new Pedido();
    pedido.id = 123;

    let usedId;

    jest
      .spyOn(pedidosService, 'solicitarPagamento')
      .mockImplementation(async (id) => {
        usedId = id;
        return Promise.resolve(pedido);
      });

    const updated = await controller.solicitarPagamento(pedido.id);

    expect(usedId).toBe(pedido.id);
    expect(updated).toBe(pedido);
  });

  it('finalizes the order', async () => {
    const pedido = new Pedido();
    pedido.id = 123;

    let usedId;

    jest.spyOn(pedidosService, 'finalizar').mockImplementation(async (id) => {
      usedId = id;
      return Promise.resolve(pedido);
    });

    const updated = await controller.finalizar(pedido.id);

    expect(usedId).toBe(pedido.id);
    expect(updated).toBe(pedido);
  });
});

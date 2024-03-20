import { PedidosControllerInterface } from 'src/core/pedidos/controller/pedidos.controller.interface';
import { PedidosAPI } from './pedidos.api';
import { PedidosController } from 'src/core/pedidos/controller/pedidos.controller';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Pedido } from 'src/core/pedidos/entities/pedido.entity';

describe('PedidosAPI', () => {
  let controller: PedidosControllerInterface;
  let api: PedidosAPI;

  beforeEach(() => {
    controller = new PedidosController(null, null, null);
    api = new PedidosAPI(controller);
  });

  it('indexes', async () => {
    const findAllMock = jest.spyOn(controller, 'findAll').mockImplementation();

    await api.index();

    expect(findAllMock).toHaveBeenCalled();
  });

  it('creates', async () => {
    let input = new CreatePedidoDto();

    const createMock = jest.spyOn(controller, 'create').mockImplementation();

    await api.create(input);

    expect(createMock).toHaveBeenCalledWith(input);
  });

  it('finds one', async () => {
    const pedidoId = 123;
    const pedido = new Pedido();

    const findOneMock = jest
      .spyOn(controller, 'findOne')
      .mockImplementation(() => Promise.resolve(pedido));

    await api.show(pedidoId);

    expect(findOneMock).toHaveBeenCalledWith(pedidoId);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PedidoItensAPI } from './pedido_itens.api';
import { PedidosService } from 'src/core/pedidos/pedidos.service';

describe('PedidoItensController', () => {
  let controller: PedidoItensAPI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoItensAPI],
      providers: [PedidosService],
    }).compile();

    controller = module.get<PedidoItensAPI>(PedidoItensAPI);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

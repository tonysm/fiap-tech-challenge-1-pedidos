import { Test, TestingModule } from '@nestjs/testing';
import { PedidosAPI } from './pedidos.api';
import { PedidosService } from 'src/core/pedidos/pedidos.service';

describe('PedidosController', () => {
  let controller: PedidosAPI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosAPI],
      providers: [PedidosService],
    }).compile();

    controller = module.get<PedidosAPI>(PedidosAPI);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

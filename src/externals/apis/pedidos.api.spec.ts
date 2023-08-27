import { Test, TestingModule } from '@nestjs/testing';
import { PedidosAPI } from './pedidos.api';
import { PedidosController } from 'src/core/pedidos/controller/pedidos.controller';

describe('PedidosController', () => {
  let controller: PedidosAPI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosAPI],
      providers: [PedidosController],
    }).compile();

    controller = module.get<PedidosAPI>(PedidosAPI);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

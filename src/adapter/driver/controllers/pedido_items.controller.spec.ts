import { Test, TestingModule } from '@nestjs/testing';
import { PedidoItemsController } from './pedido_items.controller';
import { PedidosService } from 'src/core/pedidos/pedidos.service';

describe('PedidoItemsController', () => {
  let controller: PedidoItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoItemsController],
      providers: [PedidosService],
    }).compile();

    controller = module.get<PedidoItemsController>(PedidoItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

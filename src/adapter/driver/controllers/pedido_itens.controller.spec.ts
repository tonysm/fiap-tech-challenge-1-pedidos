import { Test, TestingModule } from '@nestjs/testing';
import { PedidoItensController } from './pedido_itens.controller';
import { PedidosService } from 'src/core/pedidos/pedidos.service';

describe('PedidoItensController', () => {
  let controller: PedidoItensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoItensController],
      providers: [PedidosService],
    }).compile();

    controller = module.get<PedidoItensController>(PedidoItensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

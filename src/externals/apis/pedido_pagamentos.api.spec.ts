import { PedidosControllerInterface } from 'src/core/pedidos/controller/pedidos.controller.interface';
import { PedidoPagamentosAPI } from './pedido_pagamentos.api';
import { PedidosController } from 'src/core/pedidos/controller/pedidos.controller';

describe('PedidoPagamentosAPI', () => {
  let controller: PedidosControllerInterface;
  let api: PedidoPagamentosAPI;

  beforeEach(() => {
    controller = new PedidosController(null, null, null);
    api = new PedidoPagamentosAPI(controller);
  });

  it('requests payment', async () => {
    const pedidoId = 123;

    const paymentRequestMock = jest
      .spyOn(controller, 'solicitarPagamento')
      .mockImplementation();

    await api.solicitarPagamento(pedidoId);

    expect(paymentRequestMock).toHaveBeenCalledWith(pedidoId);
  });
});

import { PedidosControllerInterface } from "src/core/pedidos/controller/pedidos.controller.interface"
import { PedidoPagamentosAPI } from "./pedido_pagamentos.api"
import { PedidosController } from "src/core/pedidos/controller/pedidos.controller"
import { Pedido } from "src/core/pedidos/entities/pedido.entity"
import { ConfirmaPagamentoDoPedidoDto, ResultadoPagamento } from "./dto/confirma-pagamento-do-pedido.dto"

describe('PedidoPagamentosAPI', () => {
    let controller: PedidosControllerInterface
    let api: PedidoPagamentosAPI

    beforeEach(() => {
        controller = new PedidosController(null, null, null, null)
        api = new PedidoPagamentosAPI(controller)
    })

    it('requests payment', async () => {
        let pedidoId = 123

        let paymentRequestMock = jest.spyOn(controller, 'solicitarPagamento').mockImplementation()

        await api.solicitarPagamento(pedidoId)

        expect(paymentRequestMock).toHaveBeenCalledWith(pedidoId)
    })

    it('confirms payment as failure', async () => {
        let pedidoId = 123
        let input = {
            resultadoPagamento: ResultadoPagamento.FALHA
        } as ConfirmaPagamentoDoPedidoDto

        let confirmPaymentMock = jest.spyOn(controller, 'confirmaPagamento').mockImplementation()

        await api.confirmarPagamento(pedidoId, input)

        expect(confirmPaymentMock).toHaveBeenCalledWith(pedidoId, false)
    })

    it('confirms payment as success', async () => {
        let pedidoId = 123
        let input = {
            resultadoPagamento: ResultadoPagamento.SUCESSO
        } as ConfirmaPagamentoDoPedidoDto

        let confirmPaymentMock = jest.spyOn(controller, 'confirmaPagamento').mockImplementation()

        await api.confirmarPagamento(pedidoId, input)

        expect(confirmPaymentMock).toHaveBeenCalledWith(pedidoId, true)
    })
})

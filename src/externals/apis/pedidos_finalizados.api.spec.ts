import { PedidosControllerInterface } from "src/core/pedidos/controller/pedidos.controller.interface"
import { PedidosFinalizadosAPI } from "./pedidos_finalizados.api"
import { PedidosController } from "src/core/pedidos/controller/pedidos.controller"

describe('PedidosFinalizadosAPI', () => {
    let controller: PedidosControllerInterface
    let api: PedidosFinalizadosAPI

    beforeEach(() => {
        controller = new PedidosController(null, null, null, null)
        api = new PedidosFinalizadosAPI(controller)
    })

    it('finalizes orders', async () => {
        let pedidoId = 123

        let finalizarMock = jest.spyOn(controller, 'finalizar').mockImplementation()

        await api.create(pedidoId)

        expect(finalizarMock).toHaveBeenCalledWith(pedidoId)
    })
})

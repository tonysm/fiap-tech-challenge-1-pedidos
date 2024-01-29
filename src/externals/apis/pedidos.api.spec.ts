import { PedidosControllerInterface } from "src/core/pedidos/controller/pedidos.controller.interface"
import { PedidosAPI } from "./pedidos.api"
import { PedidosController } from "src/core/pedidos/controller/pedidos.controller"
import { CreatePedidoDto } from "./dto/create-pedido.dto"

describe('PedidosAPI', () => {
    let controller: PedidosControllerInterface
    let api: PedidosAPI

    beforeEach(() => {
        controller = new PedidosController(null, null, null, null)
        api = new PedidosAPI(controller)
    })

    it('indexes', async () => {
        const findAllMock = jest.spyOn(controller, 'findAll').mockImplementation()

        await api.index()

        expect(findAllMock).toHaveBeenCalled()
    })

    it('creates', async () => {
        let input = new CreatePedidoDto

        const createMock = jest.spyOn(controller, 'create').mockImplementation()

        await api.create(input)

        expect(createMock).toHaveBeenCalledWith(input)
    })

    it('finds one', async () => {
        let pedidoId = 123

        const findOneMock = jest.spyOn(controller, 'findOne').mockImplementation()

        await api.show(pedidoId)

        expect(findOneMock).toHaveBeenCalledWith(pedidoId)
    })
})

import { Item } from "src/core/pedidos/entities/item.entity"
import { Pedido } from "src/core/pedidos/entities/pedido.entity"
import { PedidosRepositoryInterface } from "src/core/pedidos/repositories/pedidos.repository"
import { Repository } from "typeorm"
import { PedidosRepository } from "./pedidos.repository"
import { PedidoNaoEncontrado } from "src/core/pedidos/exceptions/pedido.exception"

describe('PedidosRepository', () => {
    let pedidosOrm: Repository<Pedido>
    let itensOrm: Repository<Item>
    let repository: PedidosRepositoryInterface

    beforeEach(() => {
        pedidosOrm = new Repository(Pedido, null, null)
        itensOrm = new Repository(Item, null, null)
        repository = new PedidosRepository(pedidosOrm, itensOrm)
    })

    it('finds all orders', async () => {
        let all = [new Pedido]

        let usedOptions
        jest.spyOn(pedidosOrm, 'find').mockImplementation(async (options) => {
            usedOptions = options
            return all
        })

        const found = await repository.findAll()

        expect(found).toBe(all)
        expect(usedOptions).toEqual({ loadEagerRelations: true })
    })

    it('finds one or fail works', async () => {
        let pedido = new Pedido
        pedido.id = 123

        let usedCriteria
        jest.spyOn(pedidosOrm, 'findOneBy').mockImplementation(async (criteria) => {
            usedCriteria = criteria
            return pedido
        })

        const found = await repository.findOneOrFail(pedido.id)

        expect(found).toBe(pedido)
        expect(usedCriteria).toEqual({ id: pedido.id })
    })

    it('finds one or fail fails when not found', async () => {
        jest.spyOn(pedidosOrm, 'findOneBy').mockImplementation(async () => null)

        try {
            await repository.findOneOrFail(123)
            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(PedidoNaoEncontrado)
        }
    })

    it('finds one item', async () =>{
        let item = new Item
        item.id = 123

        let usedCriteria
        jest.spyOn(itensOrm, 'findOneBy').mockImplementation(async (criteria) => {
            usedCriteria = criteria
            return item
        })

        const found = await repository.findOneItem(item.id)

        expect(found).toBe(item)
        expect(usedCriteria).toEqual({ id: item.id })
    })

    it('delete item', async () =>{
        let usedCriteria
        jest.spyOn(itensOrm, 'delete').mockImplementation(async (criteria) => {
            usedCriteria = criteria
            return null
        })

        await repository.deleteItem(123)

        expect(usedCriteria).toEqual({ id: 123 })
    })

    it('saves order', async () =>{
        let pedido = new Pedido
        pedido.id = 123

        jest.spyOn(pedidosOrm, 'save').mockImplementation(async (pedido) => pedido as Pedido)

        const found = await repository.save(pedido)

        expect(found).toBe(pedido)
    })
})

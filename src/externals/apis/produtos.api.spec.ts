import { ProdutosControllerInterface } from "src/core/produtos/controller/produtos.controller.interface"
import { ProdutosAPI } from "./produtos.api"
import { ProdutosController } from "src/core/produtos/controller/produtos.controller"
import { CreateProdutoDto } from "./dto/create-produto.dto"
import { Categoria, Produto } from "src/core/produtos/entities/produto.entity"
import { HttpException } from "@nestjs/common"
import { UpdateProdutoDto } from "./dto/update-produto.dto"

describe('ProdutosAPI', () => {
    let controller: ProdutosControllerInterface
    let api: ProdutosAPI

    beforeEach(() => {
        controller = new ProdutosController(null, null)
        api = new ProdutosAPI(controller)
    })

    it('creates', async () => {
        let input = new CreateProdutoDto

        const createMock = jest.spyOn(controller, 'create').mockImplementation()

        await api.create(input)

        expect(createMock).toHaveBeenCalledWith(input)
    })

    it('finds all', async () => {
        const findAllMock = jest.spyOn(controller, 'findAll').mockImplementation()

        await api.findAll(null)

        expect(findAllMock).toHaveBeenCalled()
    })

    it('finds all by category', async () => {
        let categoria = Categoria.LANCHE

        const findAllByCategoriaMock = jest.spyOn(controller, 'findAllByCategoria').mockImplementation()

        await api.findAll(categoria)

        expect(findAllByCategoriaMock).toHaveBeenCalledWith(categoria)
    })

    it('finds one', async () => {
        let produto = new Produto
        produto.id = 123

        let usedId
        jest.spyOn(controller, 'findOne').mockImplementation(async (id) => {
            usedId = id

            return produto
        })

        const found = await api.findOne(`${produto.id}`)

        expect(found).toBe(produto)
        expect(usedId).toEqual(produto.id)
    })

    it('finds one fails', async () => {
        jest.spyOn(controller, 'findOne').mockImplementation(async () => null)

        try {
            await api.findOne(`123`)
            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException)
        }
    })

    it('updates', async () => {
        let produto = new Produto
        produto.id = 123

        let input = new UpdateProdutoDto

        let usedId, usedInput
        jest.spyOn(controller, 'update').mockImplementation(async (id, input) => {
            usedId = id
            usedInput = input

            return produto
        })

        const updated = await api.update(`${produto.id}`, input)

        expect(updated).toBe(produto)
        expect(usedId).toEqual(produto.id)
        expect(usedInput).toEqual(input)
    })

    it('removes', async () => {
        let produto = new Produto
        produto.id = 123

        const removeMock = jest.spyOn(controller, 'remove').mockImplementation()

        await api.remove(`${produto.id}`)

        expect(removeMock).toHaveBeenCalledWith(produto.id)
    })
})

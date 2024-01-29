import { Categoria, Produto } from "src/core/produtos/entities/produto.entity"
import { ProdutosRepositoryInterface } from "src/core/produtos/repositories/produtos.repository"
import { Repository } from "typeorm"
import { ProdutosRepository } from "./produtos.repository"

describe('ProdutosRepository', () => {
    let orm: Repository<Produto>
    let repository: ProdutosRepositoryInterface

    beforeEach(() => {
        orm = new Repository(Produto, null, null)
        repository = new ProdutosRepository(orm)
    })

    it('saves produtos', async () => {
        let produto = new Produto

        jest.spyOn(orm, 'save').mockImplementation(async (produto) => produto as Produto)

        const saved = await repository.save(produto)

        expect(saved).toBe(produto)
    })

    it('finds all', async () => {
        let all = [new Produto]

        jest.spyOn(orm, 'find').mockImplementation(async () => all)

        const found = await repository.findAll()

        expect(found).toBe(all)
    })

    it('find by id', async () => {
        let produto = new Produto
        produto.id = 123

        let usedCriteria
        jest.spyOn(orm, 'findOneBy').mockImplementation(async (criteria) => {
            usedCriteria = criteria
            return produto
        })

        const found = await repository.findById(produto.id)

        expect(found).toBe(produto)
        expect(usedCriteria).toEqual({ id: produto.id })
    })

    it('deletes', async () => {
        let usedDeletedCriteria
        jest.spyOn(orm, 'delete').mockImplementation(async (criteria) => {
            usedDeletedCriteria = criteria
            return null
        })

        await repository.delete(123)

        expect(usedDeletedCriteria).toEqual({ id: 123 })
    })

    it('find all by criteria', async () => {
        let all = [new Produto]

        let usedCriteria
        jest.spyOn(orm, 'findBy').mockImplementation(async (criteria) => {
            usedCriteria = criteria
            return all
        })

        const found = await repository.findAllByCategoria(Categoria.LANCHE)

        expect(found).toBe(all)
        expect(usedCriteria).toEqual({ categoria: Categoria.LANCHE })
    })
})

import { ProdutosRepository } from "src/externals/repositories/produtos.repository";
import { ProdutosRepositoryInterface } from "../repositories/produtos.repository";
import { ProdutosControllerInterface } from "./produtos.controller.interface";
import { ProdutosController } from "./produtos.controller";
import { ProdutosService } from "../produtos.service";
import { Categoria, Produto } from "../entities/produto.entity";
import { ProdutoNaoEncontrado } from "../exceptions/produto.exception";

describe('ProdutosController', () => {
    let repository: ProdutosRepositoryInterface;
    let controller: ProdutosControllerInterface;

    beforeEach(async () => {
        repository = new ProdutosRepository(null)
        controller = new ProdutosController(repository, new ProdutosService(repository))
    });

    it('should create', async () => {
        let savedProduto = null;

        jest.spyOn(repository, 'save').mockImplementation(async (produto) => {
            return savedProduto = produto;
        })

        const input = {
            nome: 'X-Burger',
            categoria: Categoria.LANCHE,
            descricao: 'Pão, hamburger, queijo, alface, e tomate.',
            precoUnitario: 9,
        }

        let saved = await controller.create(input)

        expect(savedProduto).not.toBeNull()
        expect(saved).toBe(savedProduto)
    });

    it('finds all', async () => {
        let all = [
            Produto.createFrom({ nome: 'X-Burger', descricao: 'Pão, hamburger, queijo, alface, e tomate.', categoria: Categoria.LANCHE, precoUnitario: 9 }),
        ]

        jest.spyOn(repository, 'findAll').mockImplementation(async () => all)

        let found = await controller.findAll()

        expect(found).toEqual(all)
    })

    it('finds all by category', async () => {
        let all = [
            Produto.createFrom({ nome: 'X-Burger', descricao: 'Pão, hamburger, queijo, alface, e tomate.', categoria: Categoria.LANCHE, precoUnitario: 9 }),
        ]

        let queriedCategoria;
        jest.spyOn(repository, 'findAllByCategoria').mockImplementation(async (categoria) => {
            queriedCategoria = categoria;
            return all;
        })

        let categoria = Categoria.LANCHE
        let found = await controller.findAllByCategoria(categoria)

        expect(found).toEqual(all)
        expect(queriedCategoria).toEqual(categoria)
    })

    it('finds one', async () => {
        let produto = Produto.createFrom({ nome: 'X-Burger', descricao: 'Pão, hamburger, queijo, alface, e tomate.', categoria: Categoria.LANCHE, precoUnitario: 9 })

        let queriedId = null;

        jest.spyOn(repository, 'findById').mockImplementation(async (id) => {
            queriedId = id
            return produto
        })

        let found = await controller.findOne(123)

        expect(found).toBe(produto)
        expect(queriedId).toEqual(123)
    })

    it('updates', async () => {
        let produto = Produto.createFrom({ nome: 'X-Burger', descricao: 'Pão, hamburger, queijo, alface, e tomate.', categoria: Categoria.LANCHE, precoUnitario: 9 })

        let queriedId;

        jest.spyOn(repository, 'findById').mockImplementation(async (id) => {
            queriedId = id;
            return Produto.createFrom({...produto})
        })

        let savedProduto;
        jest.spyOn(repository, 'save').mockImplementation(async (produto) => savedProduto = produto)

        await controller.update(123, {
            nome: 'Hamburger',
            descricao: 'Pão e queijo',
            precoUnitario: 3,
            categoria: Categoria.LANCHE,
        })

        expect(queriedId).toEqual(123)
        expect(savedProduto).not.toEqual(produto)
        expect(savedProduto.nome).toEqual('Hamburger')
        expect(savedProduto.descricao).toEqual('Pão e queijo')
        expect(savedProduto.precoUnitario).toEqual(3)
        expect(savedProduto.categoria).toEqual(Categoria.LANCHE)
    })

    it('update fails when not found', async () => {
        jest.spyOn(repository, 'findById').mockImplementation(async () => null)

        try {
            await controller.update(123, {
                nome: 'X-Burger',
                descricao: 'Pão e hamburger',
                precoUnitario: 3,
                categoria: Categoria.ACOMPANHAMENTO,
            })

            fail('should have failed')
        } catch (e) {
            expect(e).toBeInstanceOf(ProdutoNaoEncontrado)
        }
    })

    it('removes', async () => {
        let id = 123;

        let removedId;

        jest.spyOn(repository, 'delete').mockImplementation(async (id) => {
            removedId = id;
        })

        await controller.remove(id)

        expect(removedId).toEqual(id)
    })
});

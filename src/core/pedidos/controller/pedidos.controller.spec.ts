import { PedidosRepository } from "src/externals/repositories/pedidos.repository";
import { PedidosRepositoryInterface } from "../repositories/pedidos.repository";
import { PedidosServiceInterface } from "../pedido.service.interface";
import { PagamentosServiceInterface } from "../services/pagamentos.service.interface";
import { ProducaoServiceInterface } from "../services/producao.service.interface";
import { PedidosControllerInterface } from "./pedidos.controller.interface";
import { PedidosController } from "./pedidos.controller";
import { PedidosService } from "../pedidos.service";
import { PagamentosService } from "src/externals/services/pagamentos.service";
import { ProducaoService } from "src/externals/services/producao.service";
import { PedidoAggregateFactory } from "../aggregates/pedido.aggregate.factory";
import { ClientesRepository } from "src/externals/repositories/clientes.repository";
import { ClientesRepositoryInterface } from "src/core/clientes/repositories/clientes.repository";
import { Pedido, Status, StatusPagamento } from "../entities/pedido.entity";
import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { ItemVO } from "../vo/item.vo";
import { Produto } from "src/core/produtos/entities/produto.entity";
import { Item } from "../entities/item.entity";
import { NaoPodeAlterarPedido, NaoPodeSolicitarPagamento } from "../exceptions/pedido.exception";

describe('PedidosController', () => {
    let repository: PedidosRepositoryInterface;
    let clientesRepository: ClientesRepositoryInterface;
    let service: PedidosServiceInterface;
    let pagamentos: PagamentosServiceInterface;
    let producao: ProducaoServiceInterface;
    let controller: PedidosControllerInterface;

    let createItem = (data: object): Item => {
        const item = new Item();

        for (let key in data) {
            item[key] = data[key]
        }

        return item
    };

    beforeEach(() => {
        controller = new PedidosController(
            repository = new PedidosRepository(null, null),
            new PedidosService(repository, new PedidoAggregateFactory(clientesRepository = new ClientesRepository(null), repository)),
            pagamentos = new PagamentosService(),
            producao = new ProducaoService(),
        )
    });

    it('finds all', async () => {
        let all = [new Pedido()]

        jest.spyOn(repository, 'findAll').mockImplementation(async () => all)

        let found = await controller.findAll()

        expect(found).toBe(all)
    })

    it('finds one', async () => {
        let pedido = new Pedido()

        let queriedId;
        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            queriedId = id
            return pedido
        })

        let found = await controller.findOne(123)

        expect(queriedId).toBe(123)
        expect(found).toBe(pedido)
    })

    it('creates', async () => {
        let cliente = new Cliente()

        let queriedClientId
        jest.spyOn(clientesRepository, 'findById').mockImplementation(async (id) => {
            queriedClientId = id
            return cliente
        })

        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        let created = await controller.create({
            clienteId: 123,
        })

        expect(queriedClientId).toEqual(123)
        expect(created.status).toEqual(Status.CRIANDO)
        expect(created.statusPagamento).toEqual(StatusPagamento.PENDENTE)
        expect(created.dataConfirmacaoPagamento).toBeNull()
        expect(created.itens).toEqual([])
    })

    it('adds item', async () => {
        let pedido = new Pedido()
        pedido.itens = []
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        let queriedId
        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            queriedId = id
            return pedido
        })

        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        let item = new ItemVO(1, new Produto(), 'Test observacao', 3, 111)
        let updated = await controller.addItem(11, item)

        expect(queriedId).toEqual(11)
        expect(updated.itens.length).toEqual(1)
        expect(updated.itens[0].quantidade).toBe(item.quantidade)
        expect(updated.itens[0].produto).toBe(item.produto)
        expect(updated.itens[0].observacao).toBe(item.observacao)
        expect(updated.itens[0].id).toBe(item.id)
    })

    it('cannot add itens when order status is not creating', async () => {
        let pedido = new Pedido()
        pedido.itens = []
        pedido.status = Status.FINALIZADO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async () => pedido)

        try {
            let item = new ItemVO(1, new Produto(), 'Test observacao', 3, 111)
            await controller.addItem(11, item)

            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(NaoPodeAlterarPedido)
        }
    })

    it('cannot add itens when payment status is processing', async () => {
        let pedido = new Pedido()
        pedido.itens = []
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PROCESSANDO

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async () => pedido)

        try {
            let item = new ItemVO(1, new Produto(), 'Test observacao', 3, 111)
            await controller.addItem(11, item)

            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(NaoPodeAlterarPedido)
        }
    })

    it('updates items', async () => {
        let pedido = new Pedido()
        let item = createItem({ id: 12, produto: new Produto, observacao: 'test', quantidade: 1 })
        pedido.id = 11
        pedido.itens = [item, createItem({ id: 13, produto: new Produto, observacao: 'test', quantidade: 1 })]
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        let queriedId
        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            queriedId = id
            return pedido
        })

        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        let updated = await controller.updateItem(pedido.id, item.id, {
            ...item,
            observacao: 'updated',
            quantidade: 3,
        })

        expect(queriedId).toEqual(11)
        expect(updated.itens.length).toEqual(2)
        expect(updated.itens[0].produto).toBe(item.produto)
        expect(updated.itens[0].id).toBe(item.id)
        expect(updated.itens[0].quantidade).toBe(3)
        expect(updated.itens[0].observacao).toBe('updated')
    })

    it('cannot update items when order status is not creating', async () => {
        let pedido = new Pedido()
        let item = createItem({ id: 12, produto: new Produto, observacao: 'test', quantidade: 1 })
        pedido.id = 11
        pedido.itens = [item, createItem({ id: 13, produto: new Produto, observacao: 'test', quantidade: 1 })]
        pedido.status = Status.FINALIZADO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async () => pedido)
        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        try {
            await controller.updateItem(pedido.id, item.id, {
                ...item,
                observacao: 'updated',
                quantidade: 3,
            })

            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(NaoPodeAlterarPedido)
        }
    })

    it('cannot update items when payment status is processing', async () => {
        let pedido = new Pedido()
        let item = createItem({ id: 12, produto: new Produto, observacao: 'test', quantidade: 1 })
        pedido.id = 11
        pedido.itens = [item, createItem({ id: 13, produto: new Produto, observacao: 'test', quantidade: 1 })]
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PROCESSANDO

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async () => pedido)
        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        try {
            await controller.updateItem(pedido.id, item.id, {
                ...item,
                observacao: 'updated',
                quantidade: 3,
            })

            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(NaoPodeAlterarPedido)
        }
    })

    it('finds one item', async () => {
        let item = createItem({ id: 12, produto: new Produto, observacao: 'test', quantidade: 1 })

        let queriedId
        jest.spyOn(repository, 'findOneItem').mockImplementation(async (id) => {
            queriedId = id
            return item
        })

        let found = await controller.findOneItem(item.id)

        expect(queriedId).toEqual(item.id)
        expect(found).toBe(item)
    })

    it('removes item', async () => {
        let pedido = new Pedido()
        let item = createItem({ id: 12, produto: new Produto, observacao: 'test', quantidade: 1 })
        pedido.itens = [item]
        pedido.id = 11
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        let queriedId
        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            queriedId = id
            return pedido
        })

        let deletedId
        jest.spyOn(repository, 'deleteItem').mockImplementation(async (id) => {
            deletedId = id
        })

        const updated = await controller.removeItem(pedido.id, item.id)

        expect(queriedId).toEqual(pedido.id)
        expect(deletedId).toEqual(item.id)
        expect(updated.id).toEqual(pedido.id)
        expect(updated.itens.length).toEqual(0)
    })

    it('cannot remove item when order status isnt creating', async () => {
        let pedido = new Pedido()
        let item = createItem({ id: 12, produto: new Produto, observacao: 'test', quantidade: 1 })
        pedido.itens = [item]
        pedido.id = 11
        pedido.status = Status.FINALIZADO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => pedido)
        jest.spyOn(repository, 'deleteItem').mockImplementation(async () => null)

        try {
            await controller.removeItem(pedido.id, item.id)
            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(NaoPodeAlterarPedido)
        }
    })

    it('cannot remove item when payment status is processing', async () => {
        let pedido = new Pedido()
        let item = createItem({ id: 12, produto: new Produto, observacao: 'test', quantidade: 1 })
        pedido.itens = [item]
        pedido.id = 11
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PROCESSANDO

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => pedido)
        jest.spyOn(repository, 'deleteItem').mockImplementation(async () => null)

        try {
            await controller.removeItem(pedido.id, item.id)
            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(NaoPodeAlterarPedido)
        }
    })

    it('cannot request payment when no itens', async () => {
        let pedido = new Pedido()
        pedido.itens = []
        pedido.id = 11
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async () => pedido)

        try {
            await controller.solicitarPagamento(pedido.id)

            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(NaoPodeSolicitarPagamento)
        }
    })

    it('payment fails when payments service is down', async () => {
        let pedido = new Pedido()
        let produto = new Produto()
        let item = createItem({ id: 12, produto: produto, observacao: 'test', quantidade: 2, precoUnitario: 3})
        pedido.itens = [item]
        pedido.id = 11
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async () => pedido)
        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        jest.spyOn(pagamentos, 'solicitarPagamento').mockImplementation(async () => {
            throw new Error('service is down')
        })

        const updated = await controller.solicitarPagamento(pedido.id)

        expect(updated.statusPagamento).toEqual(StatusPagamento.FALHOU)
    })

    it('requests payment', async () => {
        let pedido = new Pedido()
        let produto = new Produto()
        let item = createItem({ id: 12, produto: produto, observacao: 'test', quantidade: 2, precoUnitario: 3})
        pedido.itens = [item]
        pedido.id = 11
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        let queriedId
        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            queriedId = id
            return pedido
        })

        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        let requestedPayment
        jest.spyOn(pagamentos, 'solicitarPagamento').mockImplementation(async (pedidoId, totalPrice) => {
            requestedPayment = { pedidoId, totalPrice }
        })

        const updated = await controller.solicitarPagamento(pedido.id)

        expect(queriedId).toEqual(pedido.id)
        expect(requestedPayment.pedidoId).toEqual(pedido.id)
        expect(requestedPayment.totalPrice).toEqual(item.precoUnitario * item.quantidade)
        expect(updated.statusPagamento).toEqual(StatusPagamento.PROCESSANDO)
    })

    it('confirms payment failure', async () => {
        let pedido = new Pedido()
        let produto = new Produto()
        let item = createItem({ id: 12, produto: produto, observacao: 'test', quantidade: 2, precoUnitario: 3})
        pedido.itens = [item]
        pedido.id = 11
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        let queriedId
        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            queriedId = id
            return pedido
        })

        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        const updated = await controller.confirmaPagamento(pedido.id, false)

        expect(queriedId).toEqual(pedido.id)
        expect(updated.statusPagamento).toEqual(StatusPagamento.FALHOU)
    });

    it('confirms payment success', async () => {
        let pedido = new Pedido()
        let produto = new Produto()
        produto.nome = 'x-burger'
        let item = createItem({ id: 12, produto: produto, observacao: 'test', quantidade: 2, precoUnitario: 3})
        pedido.itens = [item]
        pedido.id = 11
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.PENDENTE

        let queriedId
        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            queriedId = id
            return pedido
        })

        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        let producaoRequest;
        jest.spyOn(producao, 'iniciarProducao').mockImplementation(async (request) => producaoRequest = request)

        const updated = await controller.confirmaPagamento(pedido.id, true)

        expect(queriedId).toEqual(pedido.id)
        expect(updated.statusPagamento).toEqual(StatusPagamento.SUCESSO)
        expect(updated.dataConfirmacaoPagamento).not.toBeNull()
        expect(updated.status).toEqual(Status.EM_PREPARACAO)
        expect(producaoRequest.pedidoId).toEqual(pedido.id)
        expect(producaoRequest.items.length).toEqual(1)
        expect(producaoRequest.items[0].nome).toEqual(pedido.itens[0].produto.nome)
        expect(producaoRequest.items[0].observacao).toEqual(pedido.itens[0].observacao)
        expect(producaoRequest.items[0].quantidade).toEqual(pedido.itens[0].quantidade)
    });

    it('finalizes the order', async () => {
        let pedido = new Pedido()
        let produto = new Produto()
        produto.nome = 'x-burger'
        let item = createItem({ id: 12, produto: produto, observacao: 'test', quantidade: 2, precoUnitario: 3})
        pedido.itens = [item]
        pedido.id = 11
        pedido.status = Status.CRIANDO
        pedido.statusPagamento = StatusPagamento.SUCESSO
        pedido.dataConfirmacaoPagamento = new Date

        let queriedId
        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            queriedId = id
            return pedido
        })

        jest.spyOn(repository, 'save').mockImplementation(async (pedido) => pedido)

        const updated = await controller.finalizar(pedido.id)

        expect(queriedId).toEqual(pedido.id)
        expect(updated.status).toEqual(Status.FINALIZADO)
    })
});

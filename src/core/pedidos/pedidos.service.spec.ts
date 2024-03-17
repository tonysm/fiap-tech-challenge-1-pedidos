import { PedidosRepository } from "src/externals/repositories/pedidos.repository";
import { PedidoAggregateFactory } from "./aggregates/pedido.aggregate.factory";
import { SolicitarPagamentoChannel } from "src/externals/channels/solicitar.pagamento.channel";
import { PrepararPedidoChannel } from "src/externals/channels/preparar.pedido.channel";
import { PedidosService } from "./pedidos.service";
import { all } from "axios";
import { Pedido, Status, StatusPagamento } from "./entities/pedido.entity";
import { PedidoAggregate } from "./aggregates/pedido.aggregate";
import { CreatePedidoDto } from "src/externals/apis/dto/create-pedido.dto";
import { ItemVO } from "./vo/item.vo";
import { Produto } from "../produtos/entities/produto.entity";
import { Item } from "./entities/item.entity";
import { UpdatePedidoItemDto } from "src/externals/apis/dto/update-pedido-item.dto";

describe('PedidosService', () => {
    let factory: PedidoAggregateFactory;
    let repository: PedidosRepository;
    let paymentRequestChannel: SolicitarPagamentoChannel;
    let requestPreparation: PrepararPedidoChannel;
    let service: PedidosService;

    beforeEach(() => {
        service = new PedidosService(
            factory = new PedidoAggregateFactory(null, null),
            repository = new PedidosRepository(null, null),
            paymentRequestChannel = new SolicitarPagamentoChannel(null),
            requestPreparation = new PrepararPedidoChannel(null),
        );
    });

    it('finds all', async () => {
        const all = [new Pedido()];
        jest.spyOn(repository, 'findAll').mockImplementation(async () => all);

        expect(await service.findAll()).toBe(all);
    });

    it('finds one', async () => {
        const pedido = new Pedido();
        pedido.id = 123;

        let usedId;

        jest.spyOn(repository, 'findOneOrFail').mockImplementation(async (id) => {
            usedId = id;
            return pedido;
        });

        expect(await service.findOne(pedido.id)).toBe(pedido);
        expect(usedId).toEqual(pedido.id);
    });

    it('creates', async () => {
        const pedido = new Pedido();
        pedido.status = Status.CRIANDO;
        pedido.statusPagamento = StatusPagamento.PENDENTE

        jest.spyOn(factory, 'createNew').mockImplementation(async () => {
            return new PedidoAggregate(
                Status.CRIANDO,
                StatusPagamento.PENDENTE,
                null,
                [],
                null,
            );
        });

        const created = await service.create(new CreatePedidoDto());

        expect(created.status).toEqual(pedido.status);
        expect(created.statusPagamento).toEqual(pedido.statusPagamento);
    });

    it('adds item', async () => {
        const pedido = new Pedido();
        pedido.id = 123;
        pedido.status = Status.CRIANDO;
        pedido.statusPagamento = StatusPagamento.PENDENTE

        jest.spyOn(factory, 'createFromId').mockImplementation(async () => {
            return new PedidoAggregate(
                Status.CRIANDO,
                StatusPagamento.PENDENTE,
                null,
                [],
                null,
            );
        });

        const updated = await service.addItem(pedido.id, new ItemVO(
            1, new Produto(), 'Observação', 42,
        ));

        expect(updated.itens.length).toEqual(1);
        expect(updated.itens[0].quantidade).toEqual(1);
        expect(updated.itens[0].observacao).toEqual('Observação');
        expect(updated.itens[0].precoUnitario).toEqual(42);
    });

    it('update item', async () => {
        const pedido = new Pedido();
        const item = new Item();
        item.id = 234;
        item.observacao = "Observação";
        item.pedido = pedido;
        item.produto = new Produto();
        item.precoUnitario = 42;
        item.quantidade = 1;

        pedido.id = 123;
        pedido.status = Status.CRIANDO;
        pedido.statusPagamento = StatusPagamento.PENDENTE;
        pedido.itens = [item];

        jest.spyOn(factory, 'createFromId').mockImplementation(async () => {
            return new PedidoAggregate(
                Status.CRIANDO,
                StatusPagamento.PENDENTE,
                null,
                [new ItemVO(item.quantidade, item.produto, item.observacao, item.precoUnitario, item.id)],
                null,
            );
        });

        const input = new UpdatePedidoItemDto();
        input.quantidade = 2;
        input.observacao = "Changed";
        const updated = await service.updateItem(pedido.id, item.id, input);

        expect(updated.itens.length).toEqual(1);
        expect(updated.itens[0].quantidade).toEqual(2);
        expect(updated.itens[0].observacao).toEqual('Changed');
        expect(updated.itens[0].precoUnitario).toEqual(42);
    });

    it('finds one item', async () => {
        const item = new Item();
        item.id = 123;

        let usedId;

        jest.spyOn(repository, 'findOneItem').mockImplementation(async (id) => {
            usedId = id;
            return item;
        });

        expect(await service.findOneItem(item.id)).toBe(item);
        expect(usedId).toEqual(item.id);
    });

    it('finalizes', async () => {
        const pedido = new Pedido();
        pedido.id = 123;

        jest.spyOn(factory, 'createFromId').mockImplementation(async () => {
            const aggregate = new PedidoAggregate(
                pedido.status,
                pedido.statusPagamento,
                null,
                [],
            );

            aggregate.id = pedido.id;

            return aggregate;
        });

        jest.spyOn(repository, 'save').mockImplementation(async (entity) => {
            return entity;
        });

        const updated = await service.finalizar(pedido.id);

        expect(updated.status).toBe(Status.FINALIZADO);
        expect(updated.id).toEqual(pedido.id);
    });

    it('cancels pending orders', async () => {
        let clienteId = 123;
        let usedId;

        jest.spyOn(repository, 'cancelarPedidosPendentes').mockImplementation(async (id) => {
            usedId = id;
        });

        await service.cancelarPedidosPendentes(clienteId);

        expect(usedId).toEqual(clienteId);
    });

    it('requests payment', async () => {
        const pedido = new Pedido();
        const item = new Item();
        item.id = 234;
        item.observacao = "Observação";
        item.pedido = pedido;
        item.produto = new Produto();
        item.precoUnitario = 42;
        item.quantidade = 1;
        pedido.id = 123;
        pedido.status = Status.CRIANDO;
        pedido.statusPagamento = StatusPagamento.PENDENTE;
        pedido.itens = [new Item()];

        jest.spyOn(factory, 'createFromId').mockImplementation(async () => {
            const aggregate = new PedidoAggregate(
                pedido.status,
                pedido.statusPagamento,
                null,
                [new ItemVO(item.quantidade, item.produto, item.observacao, item.precoUnitario, item.id)],
            );

            aggregate.id = pedido.id;

            return aggregate;
        });

        jest.spyOn(repository, 'save').mockImplementation(async (entity) => {
            return entity;
        });

        let usedId,
            usedTotalPrice;

        jest.spyOn(paymentRequestChannel, 'solicitarPagamento').mockImplementation(async (id, totalPrice) => {
            usedId = id;
            usedTotalPrice = totalPrice;
        });

        const updated = await service.solicitarPagamento(pedido.id);

        expect(updated.statusPagamento).toBe(StatusPagamento.PROCESSANDO);
        expect(usedId).toEqual(pedido.id);
        expect(usedTotalPrice).toEqual(item.precoUnitario);
    });

    it('confirm payment success', async () => {
        const pedido = new Pedido();
        const item = new Item();
        item.id = 234;
        item.observacao = "Observação";
        item.pedido = pedido;
        item.produto = new Produto();
        item.precoUnitario = 42;
        item.quantidade = 1;
        pedido.id = 123;
        pedido.status = Status.CRIANDO;
        pedido.statusPagamento = StatusPagamento.PROCESSANDO;
        pedido.itens = [new Item()];

        jest.spyOn(factory, 'createFromId').mockImplementation(async () => {
            const aggregate = new PedidoAggregate(
                pedido.status,
                pedido.statusPagamento,
                null,
                [new ItemVO(item.quantidade, item.produto, item.observacao, item.precoUnitario, item.id)],
            );

            aggregate.id = pedido.id;

            return aggregate;
        });

        jest.spyOn(repository, 'save').mockImplementation(async (entity) => {
            return entity;
        });

        jest.spyOn(requestPreparation, 'prepararPedido').mockImplementation(async () => null);

        const updated = await service.confirmarPagamento(pedido.id, true);

        expect(updated.statusPagamento).toBe(StatusPagamento.SUCESSO);
        expect(updated.status).toBe(Status.EM_PREPARACAO);
    });

    it('confirm payment failed', async () => {
        const pedido = new Pedido();
        const item = new Item();
        item.id = 234;
        item.observacao = "Observação";
        item.pedido = pedido;
        item.produto = new Produto();
        item.precoUnitario = 42;
        item.quantidade = 1;
        pedido.id = 123;
        pedido.status = Status.CRIANDO;
        pedido.statusPagamento = StatusPagamento.PROCESSANDO;
        pedido.itens = [new Item()];

        jest.spyOn(factory, 'createFromId').mockImplementation(async () => {
            const aggregate = new PedidoAggregate(
                pedido.status,
                pedido.statusPagamento,
                null,
                [new ItemVO(item.quantidade, item.produto, item.observacao, item.precoUnitario, item.id)],
            );

            aggregate.id = pedido.id;

            return aggregate;
        });

        jest.spyOn(repository, 'save').mockImplementation(async (entity) => {
            return entity;
        });

        const updated = await service.confirmarPagamento(pedido.id, false);

        expect(updated.statusPagamento).toBe(StatusPagamento.FALHOU);
        expect(updated.status).toBe(Status.CRIANDO);
    });
});

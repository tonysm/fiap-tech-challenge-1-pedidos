import { Produto } from "src/core/produtos/entities/produto.entity";
import { Item } from "../entities/item.entity";
import { Pedido, Status, StatusPagamento } from "../entities/pedido.entity";
import { PedidoProducaoDTO } from "./producao.service.interface";

describe('ItemProducaoDTO', () => {
    it('converts to DTO', async () => {
        const produto = new Produto();
        produto.nome = "X-Burger";

        const item = new Item();
        item.id = 234;
        item.observacao = "Lorem Ipsum";
        item.precoUnitario = 42;
        item.quantidade = 2;
        item.produto = produto;

        const pedido = new Pedido();
        pedido.id = 123;
        pedido.itens = [item];
        pedido.status = Status.CRIANDO;
        pedido.statusPagamento = StatusPagamento.PENDENTE;

        const dto = PedidoProducaoDTO.fromEntity(pedido);

        expect(dto.toPayload()).toEqual({
            num_pedido: pedido.id,
            itens_attributes: [{
                nome: produto.nome,
                observacao: item.observacao,
                quantidade: item.quantidade,
            }],
        });
    });
});

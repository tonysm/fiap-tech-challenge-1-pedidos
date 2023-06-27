import { Cliente } from "src/core/clientes/entities/cliente.entity";
import { ItemVO } from "../vo/item.vo";
import { Pedido, Status, StatusPagamento } from "../entities/pedido.entity";
import { IdentifiableObject } from "src/core/bases/identifiable.object";
import { NaoPodeAlterarPedido, PedidoSemItens, StatusInvalidoParaFinalizado, StatusInvalidoParaIniciarPreparacao, StatusInvalidoParaPronto } from "../exceptions/pedido.exception";
import { PagamentoGateway } from "src/core/pagamentos/pagamento.gateway";

export class PedidoAggregate extends IdentifiableObject {
  constructor(
    private status: Status,
    private statusPagamento: StatusPagamento,
    private itens: ItemVO[],
    private cliente?: Cliente,
  ) {
    super()
  }

  iniciarPreparacaoDoPedido() {
    if (this.status != Status.RECEBIDO) {
      throw new StatusInvalidoParaIniciarPreparacao
    }

    this.status = Status.EM_PREPARACAO
  }

  encerrarPreparacaoDoPedido() {
    if (this.status != Status.EM_PREPARACAO) {
      throw new StatusInvalidoParaPronto
    }

    this.status = Status.PRONTO
  }

  finalizarPedido() {
    if (this.status != Status.PRONTO) {
      throw new StatusInvalidoParaFinalizado
    }

    this.status = Status.FINALIZADO
  }

  adicionarItem(item: ItemVO) {
    if (this.status !== Status.CRIANDO) throw new NaoPodeAlterarPedido;

    this.itens.push(item);
  }

  atualizaItem(itemId: number, quantidade: number, observacao: string) {
    if (this.status !== Status.CRIANDO) throw new NaoPodeAlterarPedido;

    this.itens = this.itens.map(item => {
      if (item.id != itemId) return item;

      return new ItemVO(
        quantidade,
        item.produto,
        observacao,
        item.precoUnitario,
        item.id,
      );
    })
  }

  removeItem(itemId: number) {
    if (this.status !== Status.CRIANDO) throw new NaoPodeAlterarPedido;

    this.itens = this.itens.filter((item) => item.id != itemId)
  }

  confirmaPagamento(pagamentos: PagamentoGateway) {
    if (this.statusPagamento === StatusPagamento.SUCESSO) throw new NaoPodeAlterarPedido;
    if (this.status !== Status.CRIANDO) throw new NaoPodeAlterarPedido;
    if (this.itens.length === 0) throw new PedidoSemItens;

    return pagamentos
        .checkout(this)
        .then(() => {
            this.statusPagamento = StatusPagamento.SUCESSO;
            this.status = Status.RECEBIDO;
        })
        .catch(() => {
            this.statusPagamento = StatusPagamento.FALHOU;
        })
  }

  toEntity(): Pedido {
    const pedido = new Pedido()

    pedido.id = this.id
    pedido.cliente = this.cliente
    pedido.itens = this.itens.map(item => item.toEntity());
    pedido.status = this.status
    pedido.statusPagamento = this.statusPagamento

    return pedido
  }
}

import { Cliente } from 'src/core/clientes/entities/cliente.entity';
import { ItemVO } from '../vo/item.vo';
import { Pedido, Status, StatusPagamento } from '../entities/pedido.entity';
import { IdentifiableObject } from 'src/core/bases/identifiable.object';
import { NaoPodeAlterarPedido } from '../exceptions/pedido.exception';

export class PedidoAggregate extends IdentifiableObject {
  constructor(
    private status: Status,
    private statusPagamento: StatusPagamento,
    private dataConfirmacaoPagamento: Date,
    private itens: ItemVO[],
    private cliente?: Cliente,
  ) {
    super();
  }

  adicionarItem(item: ItemVO) {
    if (this.status !== Status.CRIANDO) throw new NaoPodeAlterarPedido();
    if (this.statusPagamento === StatusPagamento.PROCESSANDO)
      throw new NaoPodeAlterarPedido();

    this.itens.push(item);
  }

  atualizaItem(itemId: number, quantidade: number, observacao: string) {
    if (this.status !== Status.CRIANDO) throw new NaoPodeAlterarPedido();
    if (this.statusPagamento === StatusPagamento.PROCESSANDO)
      throw new NaoPodeAlterarPedido();

    this.itens = this.itens.map((item) => {
      if (item.id != itemId) return item;

      return new ItemVO(
        quantidade,
        item.produto,
        observacao,
        item.precoUnitario,
        item.id,
      );
    });
  }

  removeItem(itemId: number) {
    if (this.status !== Status.CRIANDO) throw new NaoPodeAlterarPedido();
    if (this.statusPagamento === StatusPagamento.PROCESSANDO)
      throw new NaoPodeAlterarPedido();

    this.itens = this.itens.filter((item) => item.id != itemId);
  }

  toEntity(): Pedido {
    const pedido = new Pedido();

    pedido.id = this.id;
    pedido.cliente = this.cliente;
    pedido.itens = this.itens.map((item) => item.toEntity());
    pedido.status = this.status;
    pedido.statusPagamento = this.statusPagamento;
    pedido.dataConfirmacaoPagamento = this.dataConfirmacaoPagamento;

    return pedido;
  }

  podeSolicitarPagamento() {
    if (this.itens.length === 0) {
      return false;
    }

    if (this.status !== Status.CRIANDO) {
      return false;
    }

    return (
      this.statusPagamento === StatusPagamento.FALHOU ||
      this.statusPagamento === StatusPagamento.PENDENTE
    );
  }

  marcarComoProcessando() {
    this.statusPagamento = StatusPagamento.PROCESSANDO;

    return this.toEntity();
  }

  valorTotal() {
    return this.itens.reduce((total, item) => {
      return total + item.quantidade * item.precoUnitario;
    }, 0);
  }

  pagamentoComSucesso(dataConfirmacao: Date) {
    this.statusPagamento = StatusPagamento.SUCESSO;
    this.dataConfirmacaoPagamento = dataConfirmacao;
  }

  pagamentoFalhou() {
    this.statusPagamento = StatusPagamento.FALHOU;
  }

  iniciarPreparacao() {
    this.status = Status.EM_PREPARACAO;
  }

  finalizarPedido() {
    this.status = Status.FINALIZADO;
  }
}

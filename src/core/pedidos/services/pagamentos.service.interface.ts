export interface PagamentosServiceInterface {
    solicitarPagamento(pedidoId: number, valorTotal: number);
}

export const PagamentosServiceInterface = Symbol('PagamentosServiceInterface');

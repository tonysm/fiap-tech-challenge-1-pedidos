import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { PagamentoServiceIndisponivelException } from 'src/core/pedidos/exceptions/servicos.exception';
import { PagamentosServiceInterface } from 'src/core/pedidos/services/pagamentos.service.interface';

/* istanbul ignore next */
export class PagamentosService implements PagamentosServiceInterface {
  solicitarPagamento(pedidoId: number, valorTotal: number) {
    /* istanbul ignore next */
    console.log('Fingindo fazer pagamento...', { pedidoId, valorTotal });
  }
}

export class PagamentosAPIService implements PagamentosServiceInterface {
  constructor(private url: string, private readonly http: HttpService) {}

  async solicitarPagamento(pedidoId: number, valorTotal: number) {
    await firstValueFrom(
      this.http.post(
          this.url,
          {
            pedidoId,
            valorTotal,
          },
          {
            timeout: 3_000, // 3 seconds
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error('Payment service is down', { error });

            throw new PagamentoServiceIndisponivelException();
          }),
        ),
    );
  }
}

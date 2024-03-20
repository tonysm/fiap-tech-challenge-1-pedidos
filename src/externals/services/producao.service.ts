import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ProducaoServiceIndisponivelException } from 'src/core/pedidos/exceptions/servicos.exception';
import {
  PedidoProducaoDTO,
  ProducaoServiceInterface,
} from 'src/core/pedidos/services/producao.service.interface';

/* istanbul ignore next */
export class ProducaoService implements ProducaoServiceInterface {
  iniciarProducao(pedidoProducaoDTO: PedidoProducaoDTO) {
    /* istanbul ignore next */
    console.log('Fingindo iniciar produção...', { producao: pedidoProducaoDTO });
  }
}

export const ProducaoFactory = (config: ConfigService, http: HttpService) => {
    if (config.getOrThrow<string>('PRODUCAO_PROVIDER') === 'fake') {
        return new ProducaoService();
    }

    return new ProducaoApiService(config.getOrThrow<string>('PRODUCAO_API_URL'), http);
}

export class ProducaoApiService implements ProducaoServiceInterface {
  constructor(private url: string, private readonly http: HttpService) {}

  async iniciarProducao(pedido: PedidoProducaoDTO) {
    await firstValueFrom(
      this.http
        .post(
          this.url,
          pedido.toPayload(),
          {
            timeout: 3_000, // 3 seconds
            headers: {
                Accept: 'application/json',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error('Something went wrong with production endpoint', {
              error,
            });

            throw new ProducaoServiceIndisponivelException();
          }),
        ),
    );
  }
}

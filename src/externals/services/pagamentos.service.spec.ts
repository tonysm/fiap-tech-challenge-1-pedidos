import { PagamentosAPIService } from "./pagamentos.service"
import { HttpService } from "@nestjs/axios"
import { AxiosResponse } from "axios"
import { of, throwError } from "rxjs"
import { PagamentoServiceIndisponivelException } from "src/core/pedidos/exceptions/servicos.exception"

describe('PagamentosService', () => {
    let pedidoId = 1
    let valor = 5
    let serviceUrl = 'http://example.com/payments-service'
    let http: HttpService

    it('requests payment calls external service with success', async () => {
        http = new HttpService()

        let usedUrl, usedData, usedConfig
        jest.spyOn(http, 'post').mockImplementation((url, data, config) => {
            usedUrl = url
            usedData = data
            usedConfig = config
            return of({
                data: ['OK'],
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {}
            } as AxiosResponse)
        })

        await new PagamentosAPIService(serviceUrl, http).solicitarPagamento(pedidoId, valor)

        expect(usedUrl).toEqual(serviceUrl)
        expect(usedData).toEqual({ pedidoId, valorTotal: valor })
        expect(usedConfig).toEqual({ timeout: 3_000 })
    })

    it('requests payment calls external service with failure', async () => {
        http = new HttpService()

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        jest.spyOn(http, 'post').mockImplementation(() => {
            return throwError(() => new Error('Something went wrong'))
        })

        try {
            await new PagamentosAPIService(serviceUrl, http).solicitarPagamento(pedidoId, valor)
            fail('should have failed')
        } catch (error) {
            expect(error).toBeInstanceOf(PagamentoServiceIndisponivelException)
        }

        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })
})

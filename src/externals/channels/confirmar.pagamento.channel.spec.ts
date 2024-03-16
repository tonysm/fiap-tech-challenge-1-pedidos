import { PedidosServiceInterface } from "src/core/pedidos/pedido.service.interface";
import { PubSubService } from "./pubsub.service"
import { ConfirmarPagamentoChannel } from "./confirmar.pagamento.channel";
import { PedidosService } from "src/core/pedidos/pedidos.service";
import { ResultadoPagamento } from "../apis/dto/confirma-pagamento-do-pedido.dto";
import { ConfigService } from "@nestjs/config";

describe('ConfirmarPagamentoChannel', () => {
    let pubsubService: PubSubService;
    let pedidos: PedidosServiceInterface;
    let channel: ConfirmarPagamentoChannel;

    beforeEach(() => {
        channel = new ConfirmarPagamentoChannel(
            pubsubService = new PubSubService(new ConfigService({
                'GCP_PROJECT_ID': 'fake-123',
            })),
            pedidos = new PedidosService(null, null, null, null)
        )
    });

    it('registers payment confirmed', async () => {
        let pedido = 123,
            resultado = ResultadoPagamento.SUCESSO,
            usedTopic = null,
            usedSubscription = null,
            usedPedido = null,
            usedResultado = null;

        jest.spyOn(pedidos, 'confirmarPagamento').mockImplementation(async (pedido, resultado) => {
            usedPedido = pedido
            usedResultado = resultado
        });

        jest.spyOn(pubsubService, 'consumeMessages').mockImplementation(async (topic, subscription, callback) => {
            usedTopic = topic
            usedSubscription = subscription
            callback(JSON.stringify({pedido: pedido, resultadoPagamento: resultado}))
        })

        await channel.registerMessageConsumer();

        expect(usedTopic).toEqual("confirmar-pagamento-topic")
        expect(usedSubscription).toEqual("confirmar-pagamento-topic.pedidos-subscription")
        expect(usedPedido).toEqual(pedido)
        expect(usedResultado).toBe(true)
    });
})

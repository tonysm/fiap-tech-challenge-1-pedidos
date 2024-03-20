import { PubSubService } from "./pubsub.service"
import { ConfigService } from "@nestjs/config";
import { SolicitarPagamentoChannel } from "./solicitar.pagamento.channel";

describe('SolicitarPagamentoChannel', () => {
    let pubsubService: PubSubService;
    let channel: SolicitarPagamentoChannel;

    beforeEach(() => {
        channel = new SolicitarPagamentoChannel(
            pubsubService = new PubSubService(new ConfigService({
                'GCP_PROJECT_ID': 'fake-123',
            })),
        )
    });

    it('requests payment', async () => {
        let pedido = 123,
            valorTotal = 33.33,
            usedPedido = null,
            usedValorTotal = null,
            usedTopic = null;

        jest.spyOn(pubsubService, 'publishMessage').mockImplementation(async (topic, { pedidoId, valorTotal }) => {
            usedTopic = topic
            usedPedido = pedidoId
            usedValorTotal = valorTotal
        })

        await channel.solicitarPagamento(pedido, valorTotal);

        expect(usedTopic).toEqual("solicitar-pagamento-topic")
        expect(usedPedido).toEqual(pedido)
        expect(usedValorTotal).toEqual(valorTotal)
    });
})

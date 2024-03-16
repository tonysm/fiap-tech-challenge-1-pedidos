import { PedidosServiceInterface } from "src/core/pedidos/pedido.service.interface";
import { PubSubService } from "./pubsub.service"
import { PedidosService } from "src/core/pedidos/pedidos.service";
import { ConfigService } from "@nestjs/config";
import { FinalizarPedidoChannel } from "./finalizar.pedido.channel";

describe('PrepararPedidoChannel', () => {
    let pubsubService: PubSubService;
    let pedidos: PedidosServiceInterface;
    let channel: FinalizarPedidoChannel;

    beforeEach(() => {
        channel = new FinalizarPedidoChannel(
            pubsubService = new PubSubService(new ConfigService({
                'GCP_PROJECT_ID': 'fake-123',
            })),
            pedidos = new PedidosService(null, null, null, null)
        )
    });

    it('marks an order as finalized', async () => {
        let pedido = 123,
            usedTopic = null,
            usedSubscription = null,
            usedPedido = null;

        jest.spyOn(pedidos, 'finalizar').mockImplementation(async (pedido) => {
            usedPedido = pedido
        });

        jest.spyOn(pubsubService, 'consumeMessages').mockImplementation(async (topic, subscription, callback) => {
            usedTopic = topic
            usedSubscription = subscription
            callback(JSON.stringify({ pedido: pedido }))
        })

        await channel.registerMessageConsumer();

        expect(usedTopic).toEqual("concluir-pedido-topic")
        expect(usedSubscription).toEqual("concluir-pedido-topic.pedido-subscription")
        expect(usedPedido).toEqual(pedido)
    });
})

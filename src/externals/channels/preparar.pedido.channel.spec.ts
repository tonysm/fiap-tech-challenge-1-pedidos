import { Pedido } from "src/core/pedidos/entities/pedido.entity";
import { PedidoProducaoDTO, PrepararPedidoChannel } from "./preparar.pedido.channel";
import { PubSubService } from "./pubsub.service"
import { ConfigService } from "@nestjs/config";

describe('PrepararPedidoChannel', () => {
    let pubsubService: PubSubService;
    let channel: PrepararPedidoChannel;

    beforeEach(() => {
        channel = new PrepararPedidoChannel(
            pubsubService = new PubSubService(new ConfigService({
                'GCP_PROJECT_ID': 'fake-123',
            })),
        )
    });

    it('requests preparation', async () => {
        let entity = new Pedido
        entity.itens = []
        entity.id = 123
        let pedido: PedidoProducaoDTO = PedidoProducaoDTO.fromEntity(entity)

        let usedTopic,
            usedPayload;

        jest.spyOn(pubsubService, 'publishMessage').mockImplementation(async (topic, payload) => {
            usedTopic = topic
            usedPayload = payload
        })

        await channel.prepararPedido(pedido);

        expect(usedTopic).toEqual("solicitar-preparo-topic")
        expect(usedPayload).toEqual(pedido.toPayload())
    });
})

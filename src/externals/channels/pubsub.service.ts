import { PubSub, Subscription, Topic } from "@google-cloud/pubsub" 
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PubSubService {
    private pubSubClient: PubSub;

    constructor(
        @Inject(ConfigService)
        config: ConfigService
    ) {
        console.log(`project-id ${config.getOrThrow("GCP_PROJECT_ID")}`)
        this.pubSubClient = new PubSub({
            "projectId": config.getOrThrow("GCP_PROJECT_ID")
        })

        console.log("Is emulator: " + this.pubSubClient.isEmulator)
    }

    async publishMessage(topicName: string, data: any): Promise<void> {
        const topic = await this.getTopic(topicName)
        const dataBuffer = Buffer.from(JSON.stringify(data))
        
        try {
            await topic.publish(dataBuffer)
            // console.log(`[SERVICO-PEDIDO][TOPIC] - Mensagem enviada no topico ${topicName} ${JSON.stringify(data)}`)
        } catch (error) {
            console.error(`Error publishing on ${topic.name}:`, error)
        }
    }

    async consumeMessages(topicName: string, subscriptionName: string, callback: (message: string) => void): Promise<void> {
        const topic = await this.getTopic(topicName)
        const subscription = await this.getSubscription(topic, subscriptionName)

        subscription.on("message", (message) => {
            const data = message.data.toString()
            // console.log(`[SERVICO-PEDIDO][TOPIC] - Mensagem recebida no topico ${topicName} ${data}`)
            callback(data)
            message.ack()
        })
    }

    private async getTopic(topicName): Promise<Topic> {
        let topic = this.pubSubClient.topic(topicName)
        let [topicExists] = await topic.exists()

        if(!topicExists) {
            [topic] = await this.pubSubClient.createTopic(topicName)
            console.log(`Topic ${topic.name} created`)
        }

        return topic
    }

    private async getSubscription(topic: Topic, subscriptionName): Promise<Subscription> {
        let subscription = this.pubSubClient.subscription(subscriptionName, {topic})
        let [subscriptionExists] = await subscription.exists()

        if(!subscriptionExists) {
            [subscription] = await topic.createSubscription(subscriptionName)
            console.log(`Subscription ${subscription.name} created`)
        }

        return subscription
    }
}
export class KafkaConsumerService {
    constructor({ kafkaConsumer }) {
        this.consumer = kafkaConsumer;
        this.handlers = new Map();
    }

    onMessage(eventType, handler) {
        this.handlers.set(eventType, handler);
    }

    async subscribe(topics) {
        const topicList = Array.isArray(topics) ? topics : [topics];
        
        for (const topic of topicList) {
            await this.consumer.subscribe({ topic, fromBeginning: false });
            console.log(`📥 Subscribed to: ${topic}`);
        }
    }

    async startConsuming() {
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    const eventType = data.eventType || message.headers?.['event-type']?.toString();
                    
                    console.log(`📨 ${topic}: block ${data.blockNumber}`);

                    const handler = this.handlers.get(eventType);
                    if (handler) {
                        await handler(data, { topic, partition, offset: message.offset });
                    } else {
                        console.warn(`⚠️ No handler for: ${eventType}`);
                    }
                } catch (error) {
                    console.error('❌ Message processing error:', error);
                }
            }
        });

        console.log('🔄 Kafka consumer started');
    }
}

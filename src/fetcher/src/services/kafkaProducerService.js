export class KafkaProducerService {
    constructor({ kafkaProducer }) {
        this.producer = kafkaProducer;
    }

    async publishDelayedBlock(blockData, delayBlocks, topic = 'blocks-delayed') {
        try {
            const message = {
                key: `${blockData.number}-delay-${delayBlocks}`,
                value: JSON.stringify({
                    blockNumber: blockData.number,
                    blockHash: blockData.hash,
                    parentHash: blockData.parentHash,
                    delayBlocks: delayBlocks,
                    timestamp: new Date().toISOString(),
                    eventType: 'delayed-block-matured'
                }),
                headers: {
                    'source': 'fetcher-service',
                    'event-type': 'delayed-block-matured',
                    'delay-blocks': delayBlocks.toString()
                }
            };

            const result = await this.producer.send({
                topic: topic,
                messages: [message]
            });

            console.log(`📤 Published delayed block ${blockData.number} (delay: ${delayBlocks}) to Kafka`);
            return result;
        } catch (error) {
            console.error(`❌ Failed to publish delayed block ${blockData.number}:`, error);
            throw error;
        }
    }
}

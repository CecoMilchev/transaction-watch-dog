import { Kafka } from 'kafkajs';

export class KafkaProducerService {
    constructor() {
        this.kafka = new Kafka({
            clientId: 'configurations-service',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
        });
        this.producer = this.kafka.producer();
        this.isConnected = false;
    }

    async connect() {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
            console.log('📤 Kafka producer connected');
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
            console.log('📤 Kafka producer disconnected');
        }
    }

    /**
     * Publish filter update event (for both regular and composite filters)
     * @param {Object} filter - Filter object
     */
    async publishFilterUpdate(filter) {
        try {
            await this.connect();

            const message = {
                key: `filter-${filter.id}`,
                value: JSON.stringify({
                    id: filter.id,
                    field: filter.field,
                    operator: filter.operator,
                    value: filter.value,
                    type: filter.type,
                    name: filter.name, // for composite filters
                    logicalOperator: filter.logical_operator, // for composite filters
                    isActive: filter.is_active,
                    timestamp: new Date().toISOString(),
                    eventType: 'filter-update'
                }),
                headers: {
                    'source': 'configurations-service',
                    'event-type': 'filter-update',
                    'filter-id': filter.id.toString()
                }
            };

            const result = await this.producer.send({
                topic: 'filter-updates',
                messages: [message]
            });

            console.log(`📤 Published filter update: ${filter.id}`);
            return result;
        } catch (error) {
            console.error(`❌ Failed to publish filter update:`, error);
            throw error;
        }
    }
}

export default KafkaProducerService;

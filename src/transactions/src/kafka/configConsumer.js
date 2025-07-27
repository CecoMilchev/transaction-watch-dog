import { Kafka } from 'kafkajs';
import { EventEmitter } from 'events';

export class ConfigConsumer extends EventEmitter {
    constructor() {
        super();
        this.kafka = new Kafka({
            clientId: 'transactions-service-config-consumer',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
        });
        this.consumer = this.kafka.consumer({ 
            groupId: 'transactions-filter-config' 
        });
        this.isConnected = false;
    }

    async connect() {
        if (!this.isConnected) {
            await this.consumer.connect();
            this.isConnected = true;
            console.log('📥 Config consumer connected to Kafka');
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.consumer.disconnect();
            this.isConnected = false;
            console.log('📥 Config consumer disconnected from Kafka');
        }
    }

    async subscribe() {
        await this.connect();
        await this.consumer.subscribe({ 
            topic: 'filter-updates', 
            fromBeginning: false 
        });
        console.log('📥 Subscribed to filter-updates topic');
    }

    async startConsuming() {
        await this.subscribe();
        
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    const eventType = data.eventType;
                    
                    console.log(`📨 Received ${eventType} for filter ${data.id}`);

                    // Emit filter update event for all filters (regular and composite)
                    if (eventType === 'filter-update') {
                        this.emit('filter:update', data);
                    } else {
                        console.warn(`⚠️ Unknown event type: ${eventType}`);
                    }
                } catch (error) {
                    console.error('❌ Error processing config message:', error);
                }
            }
        });

        console.log('🔄 Config consumer started listening for filter updates');
    }
}
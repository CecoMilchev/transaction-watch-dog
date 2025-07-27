import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
import { asValue } from 'awilix';
import container from './container.js';

dotenv.config();

(async () => {
    console.log('🚀 Transaction Service Starting...');
    
    // Setup Kafka consumer
    const kafka = new Kafka({ 
        clientId: 'transactions-service', 
        brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'] 
    });
    const kafkaConsumer = kafka.consumer({ groupId: 'transactions-group' });
    await kafkaConsumer.connect();
    
    // Register the kafkaConsumer instance in the container
    container.register('kafkaConsumer', asValue(kafkaConsumer));
    
    // Resolve services from container
    const configConsumer = container.resolve('configConsumer');
    const blockConsumer = container.resolve('blockConsumer');
    
    // Initialize all services
    console.log('� Initializing services...');
    
    // Start config consumer for filter updates
    await configConsumer.startConsuming();
    console.log('✅ Config consumer started');
    
    // Initialize block consumer for processing blocks
    await blockConsumer.init();
    console.log('✅ Block consumer initialized');
    
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down Transaction Service...');
        
        try {
            await configConsumer.disconnect();
            await kafkaConsumer.disconnect();
            console.log('✅ All connections closed gracefully');
        } catch (error) {
            console.error('❌ Error during shutdown:', error);
        }
        
        process.exit(0);
    });
    
})().catch(console.error);

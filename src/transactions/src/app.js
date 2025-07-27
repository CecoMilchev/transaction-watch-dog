import dotenv from 'dotenv';
import { BlockConsumer } from './kafka/blockConsumer.js';
import { KafkaConsumerService } from './kafka/kafkaConsumerService.js';
import { TransactionProcessor } from './processors/transactionProcessor.js';
import { FilterProcessor } from './processors/FilterProcessor.js';
import { Kafka } from 'kafkajs';

dotenv.config();

(async () => {
    console.log('� Transaction Service starting...');
    
    // Setup Kafka consumer
    const kafka = new Kafka({ clientId: 'transactions-consumer', brokers: ['localhost:9092'] });
    const kafkaConsumer = kafka.consumer({ groupId: 'transactions-block-consumer' });
    await kafkaConsumer.connect();

    // Create services
    const kafkaConsumerService = new KafkaConsumerService({ kafkaConsumer });
    const filterProcessor = new FilterProcessor();
    const transactionProcessor = new TransactionProcessor(filterProcessor, null);
    const blockConsumer = new BlockConsumer(kafkaConsumerService, transactionProcessor);
    
    await blockConsumer.init();
    console.log('✅ Transaction Service running - listening for blocks...');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down...');
        await blockConsumer.disconnect();
        await kafkaConsumer.disconnect();
        process.exit(0);
    });
})().catch(console.error);

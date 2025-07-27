import dotenv from 'dotenv';
import { TransactionProcessor } from './processors/transactionProcessor.js';
import { FilterProcessor } from './processors/filterProcessor.js';
import { TransactionDetailsFetcher } from './services/transactionDetailsFetcher.js';
import { TransactionService } from './services/transactionService.js';
import { ConfigConsumer } from './kafka/configConsumer.js';
import { BlockConsumer } from './kafka/blockConsumer.js';
import { KafkaConsumerService } from './kafka/kafkaConsumerService.js';
import { Kafka } from 'kafkajs';
import { ethers } from 'ethers';

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
    
    // Setup Infura provider
    const providerUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
    const provider = new ethers.JsonRpcProvider(providerUrl);
    
    // Create services
    const configConsumer = new ConfigConsumer();
    const filterProcessor = new FilterProcessor(configConsumer);
    const transactionService = new TransactionService();

    const transactionDetailsFetcher = new TransactionDetailsFetcher(provider, {
        rateLimit: 500,
        creditsPerTransaction: 80,
        batchSize: 16,
        delayBetweenBatches: 0
    });
    
    // Create processors
    const transactionProcessor = new TransactionProcessor(
        filterProcessor,
        transactionService,
        transactionDetailsFetcher,
        provider
    );
    
    // Create Kafka consumers
    const kafkaConsumerService = new KafkaConsumerService({ kafkaConsumer });
    const blockConsumer = new BlockConsumer(kafkaConsumerService, transactionProcessor);
    
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

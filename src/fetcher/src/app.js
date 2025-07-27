import dotenv from 'dotenv';
import { InfuraWebClient } from './types/infuraWebClient.js';
import { BlockProcessor } from './types/blockProcessor.js';
import { BlockDelayService } from './services/BlockDelayService.js';
import { BlockStorageService } from './services/BlockStorageService.js';
import { KafkaProducerService } from './services/kafkaProducerService.js';
import { Kafka } from 'kafkajs';
import Redis from 'ioredis';

dotenv.config();

(async () => {
    // Setup Redis clients
    const redisConfig = { host: 'localhost', port: 6379 };
    const redisClientForStorage = new Redis(redisConfig);
    const redisClientForDelay = new Redis(redisConfig);

    // Setup Kafka producer
    const kafka = new Kafka({ clientId: 'fetcher-service', brokers: ['localhost:9092'] });
    const kafkaProducer = kafka.producer();
    await kafkaProducer.connect();

    // Create services
    const kafkaProducerService = new KafkaProducerService({ kafkaProducer });
    const blockStorage = new BlockStorageService(redisClientForStorage);
    const blockProcessor = new BlockProcessor(blockStorage);
    const blockDelayService = new BlockDelayService(redisClientForDelay, kafkaProducerService, 2);
    
    // Connect to Infura
    const url = `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`;
    const client = new InfuraWebClient(url, blockProcessor);

    console.log('✅ Fetcher Service starting...');
    
    setTimeout(() => client.connect(), 1000);
    // setTimeout(() => client.disconnect(), 60 * 1000);
    // setTimeout(() => process.exit(0), 60 * 1000);
})().catch(console.error);
import { createContainer, asClass, asValue, asFunction, InjectionMode } from 'awilix';
import { KafkaProducerService } from './services/kafkaProducerService.js';
import { BlockStorageService } from './services/BlockStorageService.js';
import { BlockDelayService } from './services/BlockDelayService.js';
import { BlockProcessor } from './types/blockProcessor.js';
import { InfuraWebClient } from './types/infuraWebClient.js';
import { Kafka } from 'kafkajs';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const container = createContainer({
  injectionMode: InjectionMode.PROXY
});

container.register({
  infuraApiKey: asValue(process.env.INFURA_API_KEY),
  delayBlocks: asValue(2),
  
  redisClientForStorage: asFunction(() => new Redis({ host: 'localhost', port: 6379 })).singleton(),
  redisClientForDelay: asFunction(() => new Redis({ host: 'localhost', port: 6379 })).singleton(),
  kafka: asFunction(() => new Kafka({ clientId: 'fetcher-service', brokers: ['localhost:9092'] })).singleton(),
  
  kafkaProducer: asFunction(({ kafka }) => {
    return kafka.producer();
  }).singleton(),
  
  blockStorageService: asFunction(({ redisClientForStorage }) => 
    new BlockStorageService(redisClientForStorage)
  ).singleton(),
  
  kafkaProducerService: asFunction(({ kafkaProducer }) => 
    new KafkaProducerService({ kafkaProducer })
  ).singleton(),
  
  blockProcessor: asFunction(({ blockStorageService }) => 
    new BlockProcessor(blockStorageService)
  ).singleton(),
  
  blockDelayService: asFunction(({ redisClientForDelay, kafkaProducerService, delayBlocks }) => 
    new BlockDelayService(redisClientForDelay, kafkaProducerService, delayBlocks)
  ).singleton(),
  
  infuraWebClient: asFunction(({ infuraApiKey, blockProcessor }) => {
    const url = `wss://mainnet.infura.io/ws/v3/${infuraApiKey}`;
    return new InfuraWebClient(url, blockProcessor);
  }).singleton()
});

export default container;

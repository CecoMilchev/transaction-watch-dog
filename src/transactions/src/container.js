import { createContainer, asFunction, asValue, InjectionMode } from 'awilix';
import { ethers } from 'ethers';

// Import services and processors
import { TransactionProcessor } from './processors/transactionProcessor.js';
import { FilterProcessor } from './processors/filterProcessor.js';
import { TransactionService } from './services/transactionService.js';
import { TransactionDetailsFetcher } from './services/transactionDetailsFetcher.js';
import { ConfigConsumer } from './kafka/configConsumer.js';
import { BlockConsumer } from './kafka/blockConsumer.js';
import { KafkaConsumerService } from './kafka/kafkaConsumerService.js';

// Create the container with PROXY injection mode for destructuring support
const container = createContainer({
    injectionMode: InjectionMode.PROXY
});

// Register provider
container.register({
    provider: asFunction(() => {
        const apiKey = process.env.INFURA_API_KEY;
        if (!apiKey) {
            console.warn('⚠️  INFURA_API_KEY not set, using placeholder URL');
            return new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/placeholder');
        }
        const providerUrl = `https://mainnet.infura.io/v3/${apiKey}`;
        return new ethers.JsonRpcProvider(providerUrl);
    }).singleton()
});

// Register services
container.register({
    transactionService: asFunction(() => {
        return new TransactionService();
    }).singleton(),
    
    transactionDetailsFetcher: asFunction(({ provider }) => {
        return new TransactionDetailsFetcher(provider, {
            rateLimit: 500,
            creditsPerTransaction: 80,
            batchSize: 16,
            delayBetweenBatches: 0
        });
    }).singleton(),
    
    configConsumer: asFunction(() => {
        return new ConfigConsumer();
    }).singleton(),
    
    kafkaConsumerService: asFunction(({ kafkaConsumer }) => {
        return new KafkaConsumerService({ kafkaConsumer });
    }).singleton()
});

// Register processors
container.register({
    filterProcessor: asFunction(({ configConsumer }) => {
        return new FilterProcessor(configConsumer);
    }).singleton(),
    
    transactionProcessor: asFunction(({ filterProcessor, transactionService, transactionDetailsFetcher, provider }) => {
        return new TransactionProcessor(filterProcessor, transactionService, transactionDetailsFetcher, provider);
    }).singleton(),
    
    blockConsumer: asFunction(({ kafkaConsumerService, transactionProcessor }) => {
        return new BlockConsumer(kafkaConsumerService, transactionProcessor);
    }).singleton()
});

export default container;

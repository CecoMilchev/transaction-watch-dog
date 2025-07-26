import dotenv from 'dotenv';
import { InfuraWebClient } from './types/infuraWebClient.js';
import { BlockProcessor } from './types/blockProcessor.js';
import { BlockDelayService } from './services/blockDelayService.js';
import { BlockStorageService } from './services/blockStorageService.js';
import Redis from 'ioredis';
dotenv.config();

let testBlock = {
    number: 1,
    hash: "0x11111",
}

let testBlock2 = {
    number: 2,
    hash: "0x22222",
    parentHash: "0x11111"    
}

let testBlock3 = {
    number: 3,
    hash: "0x33333",
    parentHash: "0x22222"
}

console.log(process.env.INFURA_API_KEY);

let url = `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`;

// Create separate Redis clients
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
};

const redisClientForStorage = new Redis(redisConfig);
const redisClientForDelay = new Redis(redisConfig);

let blockStorage = new BlockStorageService(redisClientForStorage);
let blockProcessor = new BlockProcessor(blockStorage);
let blockDelayService = new BlockDelayService(redisClientForDelay, 2);
// blockDelayService.init();
// let client = new InfuraWebClient(url, blockProcessor);

blockProcessor.processBlock(testBlock);
blockProcessor.processBlock(testBlock2);
blockProcessor.processBlock(testBlock3);

// setTimeout(() => {
//     client.connect();
// }, 1000);

// setTimeout(() => {
//     client.disconnect();
// }, 15 * 1000);

// setTimeout(() => {
//     console.log("Exiting after 15 seconds...");
//     process.exit(0);
// }, 15 * 1000);
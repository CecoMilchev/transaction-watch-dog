import dotenv from 'dotenv';
import { InfuraWebClient } from './types/InfuraWebClient.js';
import { BlockProcessor } from './types/BlockProcessor.js';

dotenv.config();

console.log(process.env.INFURA_API_KEY);

let url = `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`;

let blockProcessor = new BlockProcessor();

let client = new InfuraWebClient(url, blockProcessor);

setTimeout(() => {
    client.connect();
}, 1000);

setTimeout(() => {
    client.disconnect();
}, 15 * 1000);

setTimeout(() => {
    console.log(client.blockProcessor.blocks);
}, 15 * 1000);
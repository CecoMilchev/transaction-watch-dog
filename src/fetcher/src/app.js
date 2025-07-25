import dotenv from 'dotenv';
import { InfuraWebClient } from './types/InfuraWebClient.js';

dotenv.config();

console.log(process.env.INFURA_API_KEY);

let url = `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`;
let client = new InfuraWebClient(url);

setTimeout(() => {
    client.connect();
}, 1000);

setTimeout(() => {
    client.disconnect();
}, 30000);
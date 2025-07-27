import redisClient from 'ioredis';

export class BlockStorageService {
    redisClient;
    redisPublisher;
    maxBlocksToKeep = 100;

    constructor(redisClient) {
        this.redisClient = redisClient;
        this.redisPublisher = redisClient.duplicate();
    }

    async addBlock(block) {
        await this.saveBlockToRedis(block);
        await this.publishBlockEvent(block);
    }

    async saveBlockToRedis(block) {
        const blockNumber = parseInt(block.number, 16);
        const blockKey = `block:${blockNumber}`;

        const blockData = {
            number: blockNumber,
            hash: block.hash,
            parentHash: block.parentHash,
        };

        // Store with 24 hour TTL (86400 seconds)
        await this.redisClient.setex(blockKey, 86400, JSON.stringify(blockData));

        // Add to sorted set for efficient range queries
        await this.redisClient.zadd('blocks:all', blockNumber, blockNumber);
    }

    async publishBlockEvent(block) {
        const blockNumber = parseInt(block.number, 16);
        const blockEvent = {
            blockNumber: blockNumber,
            blockData: block,
            eventType: 'blockAdded'
        };

        console.log(`Published block ${blockNumber} to Redis channel 'blocks:new'`);
        
        await this.redisPublisher.publish('blocks:new', JSON.stringify(blockEvent));
    }
}
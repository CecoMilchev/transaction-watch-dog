import on from 'events';
import redisClient from 'ioredis';

export class BlockDelayService {
    delayBlocks;
    redisClient;
    kafkaProducer;

    constructor(redisClient, kafkaProducerService, delayBlocks = 2) {
        this.redisClient = redisClient;
        this.redisSubscriber = redisClient.duplicate(); // Separate client for subscriptions
        this.delayBlocks = delayBlocks;
        this.delayId = `delay-${delayBlocks}`;
        this.kafkaProducer = kafkaProducerService;

        this.addEventListeners();
    }

    addEventListeners() {
        this.redisSubscriber?.subscribe('blocks:new', 'blocks:removed');
        // Handle Redis messages
        this.redisSubscriber?.on('message', (channel, message) => {
            try {
                const eventData = JSON.parse(message);

                if (channel === 'blocks:new') {
                    this.handleNewBlock(eventData);
                } else if (channel === 'blocks:removed') {
                    this.handleBlocksRemoved(eventData);
                }
            } catch (error) {
                console.error(`Error handling Redis message from ${channel}:`, error);
            }
        });

        console.log(`🔔 BlockDelayService (${this.delayId}) subscribed to Redis channels`);
    }

    async handleNewBlock({ blockNumber, blockData, timestamp }) {
        console.log(`[Delay-${this.delayBlocks}] Received new block: ${blockNumber}`);

        try {
            // Try to emit matured blocks based on the new block
            await this.tryEmitMaturedBlocks(blockNumber);
        } catch (error) {
            console.error(`Error handling new block ${blockNumber}:`, error);
        }
    }

    async tryEmitMaturedBlocks(currentBlockNumber) {
        const maturityThreshold = currentBlockNumber - this.delayBlocks;

        console.log(`[Delay-${this.delayBlocks}] Checking for blocks mature before ${maturityThreshold}`);

        // Get all blocks that are now mature enough from Redis
        const matureBlockNumbers = await this.redisClient.zrangebyscore(
            'blocks:all',
            '-inf',
            maturityThreshold
        );

        console.log(`[Delay-${this.delayBlocks}] Found ${matureBlockNumbers.length} mature blocks:`, matureBlockNumbers);

        for (const blockNumberStr of matureBlockNumbers) {
            const blockNumber = blockNumberStr.startsWith('0x') 
                ? parseInt(blockNumberStr, 16) 
                : parseInt(blockNumberStr);
            await this.processMaturedBlock(blockNumber);
        }
    }

    async processMaturedBlock(blockNumber) {
        try {
            // Check if already processed for this delay service
            const processedKey = `processed:${this.delayId}:${blockNumber}`;
            const alreadyProcessed = await this.redisClient.exists(processedKey);

            if (alreadyProcessed) {
                return;
            }

            // Get block data from Redis
            const blockKey = `block:${blockNumber}`;
            const blockDataStr = await this.redisClient.get(blockKey);

            if (!blockDataStr) {
                console.warn(`Block ${blockNumber} not found in Redis`);
                return;
            }

            const blockData = JSON.parse(blockDataStr);

            console.log(`Emitting matured block ${blockNumber} with delay ${this.delayBlocks}`);
            
            await this.kafkaProducer.publishDelayedBlock(blockData, this.delayBlocks);
            
            // Mark as processed
            await this.redisClient.setex(processedKey, 86400, Date.now());

        } catch (error) {
            console.error(`Error processing matured block ${blockNumber}:`, error);
        }
    }
}

export default BlockDelayService;
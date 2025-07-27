export class BlockConsumer {
    constructor(kafkaConsumerService, transactionProcessor) {
        this.kafkaConsumer = kafkaConsumerService;
        this.transactionProcessor = transactionProcessor;
    }

    async init() {
        try {
            await this.kafkaConsumer.subscribe(['blocks-delayed']);
            
            // Only handle delayed blocks since that's what the fetcher sends
            this.kafkaConsumer.onMessage('delayed-block-matured', this.handleDelayedBlock.bind(this));
            
            await this.kafkaConsumer.startConsuming();
            
            console.log('✅ BlockConsumer initialized and listening for delayed blocks');
        } catch (error) {
            console.error('❌ Failed to initialize BlockConsumer:', error);
            throw error;
        }
    }

    async handleDelayedBlock(blockData, messageContext) {
        try {
            console.log(`⏰ Processing delayed block ${blockData.blockNumber} (delay: ${blockData.delayBlocks})`);
            
            // Call transaction processor directly
            const blockInfo = {
                number: blockData.blockNumber,
                hash: blockData.blockHash,
                parentHash: blockData.parentHash,
                delayBlocks: blockData.delayBlocks
            };

            await this.transactionProcessor.processBlock(blockInfo);
            
        } catch (error) {
            console.error(`❌ Error handling delayed block ${blockData.blockNumber}:`, error);
        }
    }

    async disconnect() {
        console.log('✅ BlockConsumer disconnected');
    }
}
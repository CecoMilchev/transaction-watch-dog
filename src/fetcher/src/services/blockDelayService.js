import on from 'events';
export class BlockDelayService {
    blockProcessor;
    delayBlocks;

    constructor(blockProcessor, delayBlocks = 6) {
        this.delayBlocks = delayBlocks;
        this.blockProcessor = blockProcessor;

        this.blockProcessor.on('blockProcessed', this.handleNewBlock.bind(this));
        //this.blockProcessor.on('reorgDetected', this.handleReorg.bind(this));
    }

    destroy() {
        this.blockProcessor.removeListener('blockProcessed', this.handleNewBlock.bind(this));
    }

    async handleNewBlock({ blockNumber, blockData }) {
        console.log(`Processing new block: ${blockNumber}`);
        // based on the delay, access redis,
        // post it on kafka topic
    }
}
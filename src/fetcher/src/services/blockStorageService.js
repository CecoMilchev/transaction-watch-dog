export class BlockStorageService {
    blocks = [];
    maxBlocksToKeep = 100;

    constructor() {
    }

    addBlock(block) {
        this.blocks.push(block);

        if (this.blocks.length > this.maxBlocksToKeep) {
            this.blocks = this.blocks.slice(-this.maxBlocksToKeep);
        }

        // this.blockDelayService.tryEmitMaturedBlock();
    }

    getBlock(blockNumber) {
        return this.blocks.find(block => block.number === blockNumber);
    }

    getLastBlock() {
        return this.blocks[this.blocks.length - 1] || null;
    }

    removeBlocksAfter(blockNumber) {
        const initialLength = this.blocks.length;
        this.blocks = this.blocks.filter(block => block.number <= blockNumber);
        return initialLength - this.blocks.length;
    }

    getRecentBlocks(count = 10) {
        return this.blocks.slice(-count);
    }

    getAllBlocks() {
        return [...this.blocks];
    }
}
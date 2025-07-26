export class BlockProcessor {
    blockStorage;
    lastBlock;

    constructor(blockStorage) {
        this.blockStorage = blockStorage;
    }

    processBlock(block) {
        if (this.lastBlock && block.parentHash !== this.lastBlock?.hash) {
            console.log("REORG DETECTED");
            return;
        }

        this.blockStorage.addBlock(block);
    }
}
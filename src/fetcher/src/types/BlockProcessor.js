export class BlockProcessor {
    blocks = [];
    lastBlock;

    constructor() {
        // Initialize any required properties
    }

    processBlock(block) {
        if (this.lastBlock && block.parentHash !== this.lastBlock?.hash) {
            console.log("REORG DETECTED");
            return;
        }

        // Process the block (e.g., save it to a database, etc.)
        this.lastBlock = block;
        this.blocks.push(block);
    }
}
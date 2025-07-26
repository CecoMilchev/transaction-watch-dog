import { EventEmitter } from 'events';

export class BlockProcessor extends EventEmitter {
    blockStorage;
    lastBlock;

    constructor(blockStorage) {
        super();
        this.blockStorage = blockStorage;
    }

    processBlock(block) {
        if (this.lastBlock && block.parentHash !== this.lastBlock?.hash) {
            console.log("REORG DETECTED");
            return;
        }

        this.blockStorage.addBlock(block);

        this.emit('blockProcessed', {
            blockNumber: block.number
        });
    }
}
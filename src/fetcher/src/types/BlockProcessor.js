import { EventEmitter } from 'events';

export class BlockProcessor extends EventEmitter {
    blocks = [];
    lastBlock;

    constructor() {
        super();
    }

    processBlock(block) {
        if (this.lastBlock && block.parentHash !== this.lastBlock?.hash) {
            console.log("REORG DETECTED");
            return;
        }

        this.blocks.push(block);

        this.emit('blockProcessed', {
            blockNumber: block.number
        });
    }
}
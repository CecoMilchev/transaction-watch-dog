import { EventEmitter } from 'events';

export class TransactionDetailsFetcher extends EventEmitter {
    constructor(provider, requestsPerSecond = 10) {
        super();
        this.provider = provider;
        this.requestsPerSecond = requestsPerSecond;
        this.batchSize = 20;
    }

    async fetchTransactionDetails(transactionHashes) {
        const results = [];
        const totalBatches = Math.ceil(transactionHashes.length / this.batchSize);

        for (let i = 0; i < transactionHashes.length; i += this.batchSize) {
            const batch = transactionHashes.slice(i, i + this.batchSize);
            const batchNumber = Math.floor(i / this.batchSize) + 1;
            
            const batchResults = [];
            for (const hash of batch) {
                try {
                    const transaction = await this.provider.getTransaction(hash);
                    if (transaction) batchResults.push(transaction);
                } catch (error) {
                    console.error(`Error fetching ${hash}:`, error.message);
                }
            }

            this.emit('batchComplete', { batchNumber, totalBatches, processed: batchResults });
            
            if (batchNumber < totalBatches) {
                await this.sleep(1000 / this.requestsPerSecond);
            }
        }

        return results;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default TransactionDetailsFetcher;

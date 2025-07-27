import { EventEmitter } from 'events';

export class TransactionDetailsFetcher extends EventEmitter {
    constructor(provider, requestsPerSecond = 10) {
        super();
        this.provider = provider;
        this.requestsPerSecond = requestsPerSecond;
        // IMPORTANT: ONLY FOR TESTING
        // Adjust accordingly. Values above 8 may hit rate limits.
        // Infura imposes a limit of using 500 credits per second. (one request is 80 usually)
        // The best I could get was 12 requests per second.
        this.batchSize = 2;
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
            
            // IMPORTANT: ONLY FOR TESTING
            // The idea is to test only the first batch of each block.
            // Due to the rate limiting, with the "core" Infura plan, we cannot fetch
            // all transactions in a block at once.
            break;

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

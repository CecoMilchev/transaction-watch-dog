export class TransactionProcessor {
    currentBlockInfo;

    constructor(filterProcessor, transactionService, transactionDetailsFetcher, provider) {
        this.filterProcessor = filterProcessor;
        this.transactionService = transactionService;
        this.transactionDetailsFetcher = transactionDetailsFetcher;
        this.provider = provider;
        
        this.addEventListeners();
    }

    addEventListeners() {
        this.transactionDetailsFetcher?.on('batchComplete', this.processBatch.bind(this));
    }

    async processBatch(data) {
        const filterResults = this.filterProcessor.filterTransactions(data.processed);

            if (this.transactionService && filterResults.transactions?.length > 0) {
                await this.transactionService.saveMatchedTransactions({
                    ...filterResults
                });
            }
    }

    async processBlock(blockInfo) {
        this.currentBlockInfo = blockInfo;
        console.log(`🔄 TransactionProcessor: Processing block ${blockInfo.number}`);
        
        try {
            const transactionHashes = await this.fetchTransactionHashesForBlock(blockInfo.number);
            
            if (transactionHashes.length === 0) {
                console.log(`ℹ️ No transactions found in block ${blockInfo.number}`);
                return;
            }

            console.log(`📋 Found ${transactionHashes.length} transaction hashes in block ${blockInfo.number}`);

            await this.transactionDetailsFetcher.fetchTransactionDetails(transactionHashes);
        } catch (error) {
            console.error(`❌ Error processing delayed block ${blockInfo.number}:`, error);
        }
    }

    async fetchTransactionHashesForBlock(blockNumber) {
        try {
            console.log(`🔍 Fetching transaction hashes for block ${blockNumber}`);
            
            const block = await this.provider.getBlock(blockNumber, true);
            
            if (!block) {
                throw new Error(`Block ${blockNumber} not found`);
            }

            return block.transactions || [];
            
        } catch (error) {
            console.error(`❌ Error fetching transaction hashes for block ${blockNumber}:`, error);
            return [];
        }
    }
}
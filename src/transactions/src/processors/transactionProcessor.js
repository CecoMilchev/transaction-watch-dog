export class TransactionProcessor {
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

    processBatch(data) {
        const filterResults = this.filterProcessor.filterTransactions(data.processed);
        console.log(`📊 Found ${filterResults.transactions?.length || 0} matching transactions, ${filterResults.filterId}`);
    }

    async processBlock(blockInfo) {
        console.log(`🔄 TransactionProcessor: Processing block ${blockInfo.number}`);
        
        try {
            // Fetch full block with transactions from Infura
            const transactions = await this.fetchTransactionsForBlock(blockInfo.number);
            
            // Apply filters to transactions
            const filterResults = this.filterProcessor.filterTransactions(transactions);
            console.log(`📊 Found ${filterResults.length} matching transactions`);
            
            // Save matched transactions (if service available)
            if (this.transactionService) {
                await this.transactionService.saveMatchedTransactions(filterResults);
            }
            
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
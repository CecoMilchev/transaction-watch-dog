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
            // Step 1: Fetch basic block info to get transaction hashes
            const transactionHashes = await this.fetchTransactionHashesForBlock(blockInfo.number);
            
            if (transactionHashes.length === 0) {
                console.log(`ℹ️ No transactions found in block ${blockInfo.number}`);
                return;
            }

            console.log(`📋 Found ${transactionHashes.length} transaction hashes in block ${blockInfo.number}`);

            // Step 2: Fetch full transaction details using the rate-limited service
            const transactions = await this.transactionDetailsFetcher.fetchTransactionDetails(transactionHashes);
            //const transactions = [{maxFeePerGas: 1354247125}];
            // Filter out null transactions (failed fetches)
            const validTransactions = transactions.filter(tx => tx !== null);
            console.log(`✅ Successfully fetched ${validTransactions.length}/${transactionHashes.length} transactions`);

            // Step 3: Apply filters to transactions
            const filterResults = this.filterProcessor.filterTransactions(validTransactions);
            console.log(`📊 Found ${filterResults.transactions?.length || 0} matching transactions, ${filterResults.filterId}`);
            
            // Step 4: Save matched transactions (if service available)
            if (this.transactionService && filterResults.transactions?.length > 0) {
                await this.transactionService.saveMatchedTransactions({
                    ...filterResults,
                    blockInfo,
                    totalTransactions: transactionHashes.length,
                    processedTransactions: validTransactions.length
                });
            }
            
        } catch (error) {
            console.error(`❌ Error processing block ${blockInfo.number}:`, error);
        }
    }

    async fetchTransactionHashesForBlock(blockNumber) {
        try {
            console.log(`🔍 Fetching transaction hashes for block ${blockNumber}`);
            
            // Fetch block with transaction hashes only (not full transaction objects)
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
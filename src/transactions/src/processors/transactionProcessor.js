export class TransactionProcessor {
    blockConsumer;
    filterProcessor;
    transactionService;

    constructor(blockConsumer, filterProcessor, transactionService) {
        this.blockConsumer = blockConsumer;
        this.filterProcessor = filterProcessor;
        this.transactionService = transactionService;

        this.addEventListeners();
    }

    addEventListeners() {
        this.blockConsumer.on('block-received', this.handleBlockReceived.bind(this));
    }

    handleBlockReceived(block) {
        console.log('Block received:', block);
        // Process the block and transactions
        const transactions = block.transactions || [];
        const filterResults = this.filterProcessor.processTransactions(transactions);
        
        // Save matched transactions
        this.transactionService.saveMatchedTransactions(filterResults);
    }
}
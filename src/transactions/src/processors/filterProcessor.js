export class FilterProcessor {
    configConsumer;
    currentFilter;

    constructor(configConsumer) {
        this.configConsumer = configConsumer;

        this.addEventListeners();
    }

    addEventListeners() {
        this.configConsumer.on('filter:update', this.handleFilterUpdate.bind(this));
    }

    handleFilterUpdate(newFilter) {
        console.log('Filter updated:', newFilter);
        this.currentFilter = newFilter;
    }

    filterTransactions(transactions) {
        console.log("Processing transactions:");

        return {
            filterId: this.currentFilter?.id || null,
            transactions: []
        }
    }
}
import { applyFilter } from '../utils/filterEngine.js';

export class FilterProcessor {
    configConsumer;
    currentFilter;

    constructor(configConsumer) {
        this.configConsumer = configConsumer;

        //this.addEventListeners();
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
        let filteredTransactions = transactions.filter(tx => applyFilter(tx, this.currentFilter));
        return {
            filterId: this.currentFilter?.id || null,
            transactions: filteredTransactions
        }
    }
}

export default FilterProcessor;
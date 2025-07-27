import { applyFilter } from '../utils/filterEngine.js';

export class FilterProcessor {
    constructor(configConsumer) {
        this.configConsumer = configConsumer;
        this.activeFilters = new Map(); // Map of filterId -> filter
        this.lastActivatedFilter = null; // Track the most recently activated filter
        
        this.addEventListeners();
    }

    addEventListeners() {
        if (this.configConsumer) {
            this.configConsumer.on('filter:update', this.handleFilterUpdate.bind(this));
        }
    }

    handleFilterUpdate(filterData) {
        console.log(`📝 Filter update: ${filterData.id}`);
        
        if (filterData.isActive) {
            this.activeFilters.set(filterData.id, filterData);
            this.lastActivatedFilter = filterData; // Update the last activated filter
            console.log(`🔄 Added/Updated active filter: ${filterData.id} (now using as last activated)`);
        } else {
            this.activeFilters.delete(filterData.id);
            // If the deactivated filter was the last activated, clear it
            if (this.lastActivatedFilter && this.lastActivatedFilter.id === filterData.id) {
                this.lastActivatedFilter = null;
                console.log(`⏹️ Removed last activated filter: ${filterData.id}`);
            } else {
                console.log(`⏹️ Removed inactive filter: ${filterData.id}`);
            }
        }
        console.log(`Current active filters: ${Array.from(this.activeFilters.keys()).join(', ')}`);
        console.log(`Last activated filter: ${this.lastActivatedFilter ? this.lastActivatedFilter.id : 'none'}`);
    }

    filterTransactions(transactions) {
        console.log(`🔍 Processing ${transactions.length} transactions against last activated filter`);
        
        // Only process if we have a last activated filter
        if (!this.lastActivatedFilter) {
            console.log('⚠️ No last activated filter available');
            return {
                filterId: null,
                transactions: []
            };
        }

        const filter = this.lastActivatedFilter;
        const filteredTransactions = transactions.filter(tx => applyFilter(tx, filter));
        
        if (filteredTransactions.length > 0) {
            console.log(`✅ Last activated filter ${filter.id} matched ${filteredTransactions.length} transactions`);
        } else {
            console.log(`❌ Last activated filter ${filter.id} matched 0 transactions`);
        }

        return {
            filterId: filter.id,
            transactions: filteredTransactions
        };
    }

    // Get current filter status
    getActiveFiltersCount() {
        return this.activeFilters.size;
    }

    getAllActiveFilters() {
        return Array.from(this.activeFilters.values());
    }

    getLastActivatedFilter() {
        return this.lastActivatedFilter;
    }
}

export default FilterProcessor;
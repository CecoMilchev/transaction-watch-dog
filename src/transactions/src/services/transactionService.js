import { FilteredTransaction } from '../models/index.js';

export class TransactionService {
    /**
     * Create a single filtered transaction in the database
     * @param {Object} transactionData - Transaction data from TransactionData typedef
     * @param {number} filterId - ID of the filter that triggered this transaction
     * @returns {Promise<Object>} Created transaction record
     */
    async createFilteredTransaction(transactionData, filterId) {
        try {
            const transaction = await FilteredTransaction.create({
                hash: transactionData.hash,
                from: transactionData.from,
                to: transactionData.to,
                value: transactionData.value,
                gasPrice: transactionData.gasPrice,
                gasLimit: transactionData.gasLimit,
                nonce: transactionData.nonce,
                type: transactionData.type,
                maxFeePerGas: transactionData.maxFeePerGas,
                maxPriorityFeePerGas: transactionData.maxPriorityFeePerGas,
                transactionIndex: transactionData.transactionIndex,
                blockNumber: transactionData.blockNumber?.toString(),
                blockHash: transactionData.blockHash,
                data: transactionData.data,
                chainId: transactionData.chainId,
                v: transactionData.v,
                r: transactionData.r,
                s: transactionData.s,
                filterId: filterId
            });

            console.log(`✅ Transaction ${transaction.hash} saved to database with filter ID ${filterId}`);
            return transaction;
        } catch (error) {
            console.error('❌ Failed to create filtered transaction:', error);
            throw error;
        }
    }

    /**
     * Batch insert multiple filtered transactions
     * @param {Array<{transactionData: Object, filterId: number}>} transactions - Array of transaction objects with filter IDs
     * @returns {Promise<Array<Object>>} Created transaction records
     */
    async createFilteredTransactionsBatch(transactions) {
        try {
            const transactionRecords = transactions.map(({ transactionData, filterId }) => ({
                hash: transactionData.hash,
                from: transactionData.from,
                to: transactionData.to,
                value: transactionData.value,
                gasPrice: transactionData.gasPrice,
                gasLimit: transactionData.gasLimit,
                nonce: transactionData.nonce,
                type: transactionData.type,
                maxFeePerGas: transactionData.maxFeePerGas,
                maxPriorityFeePerGas: transactionData.maxPriorityFeePerGas,
                transactionIndex: transactionData.transactionIndex,
                blockNumber: transactionData.blockNumber?.toString(),
                blockHash: transactionData.blockHash,
                data: transactionData.data,
                chainId: transactionData.chainId,
                v: transactionData.v,
                r: transactionData.r,
                s: transactionData.s,
                filterId: filterId
            }));

            const createdTransactions = await FilteredTransaction.bulkCreate(transactionRecords);
            
            console.log(`✅ Batch inserted ${createdTransactions.length} filtered transactions`);
            return createdTransactions;
        } catch (error) {
            console.error('❌ Failed to batch create filtered transactions:', error);
            throw error;
        }
    }

    /**
     * Get filtered transactions by filter ID
     * @param {number} filterId - Filter ID to search for
     * @param {Object} options - Query options (limit, offset, etc.)
     * @returns {Promise<Array<Object>>} Found transactions
     */
    async getTransactionsByFilterId(filterId, options = {}) {
        try {
            const { limit = 100, offset = 0 } = options;
            
            const transactions = await FilteredTransaction.findAll({
                where: { filterId },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return transactions;
        } catch (error) {
            console.error('❌ Failed to get transactions by filter ID:', error);
            throw error;
        }
    }

    /**
     * Get filtered transactions by transaction hash
     * @param {string} hash - Transaction hash
     * @returns {Promise<Array<Object>>} Found transactions
     */
    async getTransactionsByHash(hash) {
        try {
            const transactions = await FilteredTransaction.findAll({
                where: { hash },
                order: [['createdAt', 'DESC']]
            });

            return transactions;
        } catch (error) {
            console.error('❌ Failed to get transactions by hash:', error);
            throw error;
        }
    }

    /**
     * Save matched transactions from filter processing
     * @param {Object} filterResults - Results from filter processing
     * @param {Array} filterResults.transactions - Matched transactions
     * @param {number} filterResults.filterId - ID of the filter that matched
     * @param {Object} blockInfo - Block information
     * @param {number} totalTransactions - Total transactions in block
     * @param {number} processedTransactions - Successfully processed transactions
     */
    async saveMatchedTransactions({ transactions, filterId, blockInfo, totalTransactions, processedTransactions }) {
        try {
            if (!transactions || transactions.length === 0) {
                console.log('ℹ️ No matched transactions to save');
                return;
            }

            console.log(`💾 Saving ${transactions.length} matched transactions from block ${blockInfo.number}`);

            // Prepare transactions for batch insert
            const transactionsWithFilterId = transactions.map(transaction => ({
                transactionData: transaction,
                filterId: filterId
            }));

            // Use batch insert for better performance
            const savedTransactions = await this.createFilteredTransactionsBatch(transactionsWithFilterId);

            console.log(`✅ Successfully saved ${savedTransactions.length} filtered transactions to database`);
            console.log(`📈 Block ${blockInfo.number} summary: ${transactions.length}/${processedTransactions}/${totalTransactions} (matched/processed/total)`);

            return savedTransactions;
        } catch (error) {
            console.error('❌ Failed to save matched transactions:', error);
            throw error;
        }
    }
}
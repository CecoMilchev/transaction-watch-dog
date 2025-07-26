import ethers from 'ethers';

export class EthereumService {
    constructor(infuraApiKey, network = 'mainnet') {
        this.provider = new ethers.providers.JsonRpcProvider(
            `https://${network}.infura.io/v3/${infuraApiKey}`
        );
    }

    async getBlockWithTransactions(blockNumber) {
        try {
            const block = await this.provider.getBlockWithTransactions(blockNumber);
            return block;
        } catch (error) {
            console.error(`Error fetching block ${blockNumber}:`, error);
            throw error;
        }
    }

    async getCurrentBlockNumber() {
        return await this.provider.getBlockNumber();
    }
}
import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const FilteredTransaction = sequelize.define('FilteredTransaction', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    hash: {
        type: DataTypes.STRING(66),
        allowNull: true,
        index: true
    },
    from: {
        type: DataTypes.STRING(42),
        allowNull: true,
        index: true
    },
    to: {
        type: DataTypes.STRING(42),
        allowNull: true,
        index: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gasPrice: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gasLimit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nonce: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxFeePerGas: {
        type: DataTypes.STRING,
        allowNull: true
    },
    maxPriorityFeePerGas: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transactionIndex: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    blockNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        index: true
    },
    blockHash: {
        type: DataTypes.STRING(66),
        allowNull: true,
        index: true
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    chainId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    v: {
        type: DataTypes.STRING,
        allowNull: true
    },
    r: {
        type: DataTypes.STRING,
        allowNull: true
    },
    s: {
        type: DataTypes.STRING,
        allowNull: true
    },
    filterId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        index: true,
        comment: 'ID of the filter that triggered this transaction to be saved'
    }
}, {
    tableName: 'filtered_transactions',
    indexes: [
        {
            fields: ['block_number']
        },
        {
            fields: ['filter_id']
        }
    ]
});

export default FilteredTransaction;

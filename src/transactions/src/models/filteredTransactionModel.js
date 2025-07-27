import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const FilteredTransaction = sequelize.define('FilteredTransaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hash: {
        type: DataTypes.STRING(66),
        allowNull: true,
        defaultValue: null
    },
    from: {
        type: DataTypes.STRING(42),
        allowNull: true,
        defaultValue: null
    },
    to: {
        type: DataTypes.STRING(42),
        allowNull: true,
        defaultValue: null
    },
    value: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    gasPrice: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    gasLimit: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    nonce: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    maxFeePerGas: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    maxPriorityFeePerGas: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    transactionIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    blockNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    blockHash: {
        type: DataTypes.STRING(66),
        allowNull: true,
        defaultValue: null
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    chainId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    v: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    r: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    s: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    filterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'filtered_transactions',
    timestamps: true,
    underscored: true
});

export default FilteredTransaction;

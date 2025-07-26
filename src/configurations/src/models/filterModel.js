import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const Filter = sequelize.define('Filter', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    field: {
        type: DataTypes.STRING,
        allowNull: false
    },
    operator: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Type of value: string, number, boolean, etc.'
    }
}, {
    tableName: 'filters',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default Filter;
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
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'filters',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Filter;
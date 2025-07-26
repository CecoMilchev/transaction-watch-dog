import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const CompositeFilter = sequelize.define('CompositeFilter', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    logical_operator: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['AND', 'OR']]
        },
        defaultValue: 'AND'
    }
}, {
    tableName: 'composite_filters',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default CompositeFilter;
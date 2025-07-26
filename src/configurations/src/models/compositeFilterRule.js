import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';

const CompositeFilterRule = sequelize.define('CompositeFilterRule', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    composite_filter_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'composite_filters',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    filter_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'filters',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: 'composite_filter_rules',
    timestamps: false
});

export default CompositeFilterRule;
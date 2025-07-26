import sequelize from '../db/database.js';
import Filter from './filterModel.js';
import CompositeFilter from './compositeFilterModel.js';
import CompositeFilterRule from './compositeFilterRule.js';

// Define associations
CompositeFilter.belongsToMany(Filter, {
    through: CompositeFilterRule,
    foreignKey: 'composite_filter_id',
    otherKey: 'filter_id',
    as: 'filters'
});

Filter.belongsToMany(CompositeFilter, {
    through: CompositeFilterRule,
    foreignKey: 'filter_id',
    otherKey: 'composite_filter_id',
    as: 'composites'
});

// Direct associations for easier querying
CompositeFilter.hasMany(CompositeFilterRule, {
    foreignKey: 'composite_filter_id',
    as: 'filterLinks'
});

CompositeFilterRule.belongsTo(CompositeFilter, {
    foreignKey: 'composite_filter_id',
    as: 'compositeFilter'
});

CompositeFilterRule.belongsTo(Filter, {
    foreignKey: 'filter_id',
    as: 'filter'
});

export {
    sequelize, 
    Filter,
    CompositeFilter,
    CompositeFilterRule
};
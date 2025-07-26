import { Filter, CompositeFilter, CompositeFilterRule } from '../models/index.js';

class CompositeFilterDescriptorService {
    async getCompositeFilters() {
        return await CompositeFilter.findAll({
            include: [{
                model: Filter,
                as: 'filters',
                through: { attributes: ['position'] }
            }]
        });
    }

    async getCompositeFilterById(id) {
        return await CompositeFilter.findByPk(id, {
            include: [{
                model: Filter,
                as: 'filters',
                through: { attributes: ['position'] }
            }]
        });
    }

    async createCompositeFilterDescriptor(data) {
        const compositeFilter = await CompositeFilter.create({
            name: data.name,
            logical_operator: data.logicOperator || 'AND'
        });

        if (data.filters?.length > 0) {
            for (let i = 0; i < data.filters.length; i++) {
                const filter = await Filter.create(data.filters[i]);
                await CompositeFilterRule.create({
                    composite_filter_id: compositeFilter.id,
                    filter_id: filter.id,
                    position: i
                });
            }
        }

        return compositeFilter;
    }

    async updateCompositeFilterDescriptor(id, data) {
        await CompositeFilter.update(data, { where: { id } });
        return await CompositeFilter.findByPk(id);
    }

    async deleteCompositeFilterDescriptor(id) {
        return await CompositeFilter.destroy({ where: { id } });
    }
}

export default CompositeFilterDescriptorService;

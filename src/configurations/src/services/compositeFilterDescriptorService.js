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
                const filterData = data.filters[i];
                let filterId;

                if (typeof filterData === 'number' || filterData.id) {
                    // Use existing filter ID
                    filterId = typeof filterData === 'number' ? filterData : filterData.id;
                    
                    // Verify the filter exists
                    const existingFilter = await Filter.findByPk(filterId);
                    if (!existingFilter) {
                        throw new Error(`Filter with ID ${filterId} not found`);
                    }
                } else {
                    // Create new filter from object
                    const filter = await Filter.create(filterData);
                    filterId = filter.id;
                }

                await CompositeFilterRule.create({
                    composite_filter_id: compositeFilter.id,
                    filter_id: filterId,
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

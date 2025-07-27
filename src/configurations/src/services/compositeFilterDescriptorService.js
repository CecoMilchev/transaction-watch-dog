import { Filter, CompositeFilter, CompositeFilterRule } from '../models/index.js';

class CompositeFilterDescriptorService {
    constructor(kafkaProducerService) {
        this.kafkaProducerService = kafkaProducerService;
    }

    async getCompositeFilters() {
        return await CompositeFilter.findAll({
            include: [{
                model: Filter,
                as: 'filters',
                through: { attributes: ['position'] }
            }]
        });
    }

    async getActiveCompositeFilters() {
        return await CompositeFilter.findAll({
            where: { is_active: true },
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

        // Fetch the complete composite filter with associated filters
        const fullCompositeFilter = await CompositeFilter.findByPk(compositeFilter.id, {
            include: [{
                model: Filter,
                as: 'filters',
                through: { attributes: ['position'] }
            }]
        });

        await this.kafkaProducerService.publishFilterUpdate(fullCompositeFilter);

        return fullCompositeFilter;
    }

    async updateCompositeFilterDescriptor(id, data) {
        const oldFilter = await CompositeFilter.findByPk(id);
        if (!oldFilter) {
            return null;
        }

        await CompositeFilter.update(data, { where: { id } });
        
        // Fetch the complete composite filter with associated filters
        const updatedFilter = await CompositeFilter.findByPk(id, {
            include: [{
                model: Filter,
                as: 'filters',
                through: { attributes: ['position'] }
            }]
        });
        
        await this.kafkaProducerService.publishFilterUpdate(updatedFilter);
        
        return updatedFilter;
    }

    async activateCompositeFilter(id) {
        const compositeFilter = await CompositeFilter.findByPk(id);
        if (!compositeFilter) {
            return null;
        }

        await CompositeFilter.update({ is_active: true }, { where: { id } });
        
        // Fetch the complete composite filter with associated filters
        const updatedFilter = await CompositeFilter.findByPk(id, {
            include: [{
                model: Filter,
                as: 'filters',
                through: { attributes: ['position'] }
            }]
        });
        console.log("-----", updatedFilter.filters)
        await this.kafkaProducerService.publishFilterUpdate(updatedFilter);
        
        return updatedFilter;
    }

    async deactivateCompositeFilter(id) {
        const compositeFilter = await CompositeFilter.findByPk(id);
        if (!compositeFilter) {
            return null;
        }

        await CompositeFilter.update({ is_active: false }, { where: { id } });
        
        // Fetch the complete composite filter with associated filters
        const updatedFilter = await CompositeFilter.findByPk(id, {
            include: [{
                model: Filter,
                as: 'filters',
                through: { attributes: ['position'] }
            }]
        });
        
        await this.kafkaProducerService.publishFilterUpdate(updatedFilter);
        
        return updatedFilter;
    }

    async deleteCompositeFilterDescriptor(id) {
        const result = await CompositeFilter.destroy({ where: { id } });
        return result;
    }
}

export default CompositeFilterDescriptorService;

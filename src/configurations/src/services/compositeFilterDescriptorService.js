import { Filter, CompositeFilter, CompositeFilterRule } from '../models/index.js';
import { Op } from 'sequelize';

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

    async getActiveCompositeFilter() {
        return await CompositeFilter.findOne({
            where: { is_active: true },
            include: [{
                model: Filter,
                as: 'filters',
                through: { attributes: ['position'] }
            }]
        });
    }

    async setActiveCompositeFilter(id) {
        // Deactivate all filters first (both simple and composite)
        await Filter.update(
            { is_active: false, updated_at: new Date() },
            { where: { is_active: true } }
        );
        
        await CompositeFilter.update(
            { is_active: false, updated_at: new Date() }, 
            { where: { is_active: true } }
        );
        
        // Activate the specified filter
        const [updatedRows] = await CompositeFilter.update(
            { is_active: true, updated_at: new Date() }, 
            { where: { id } }
        );
        
        if (updatedRows === 0) {
            throw new Error(`Composite filter with ID ${id} not found`);
        }
        
        return await this.getCompositeFilterById(id);
    }

    async createCompositeFilterDescriptor(data) {
        const compositeFilter = await CompositeFilter.create({
            name: data.name,
            logical_operator: data.logicOperator || 'AND',
            is_active: data.setAsActive || false
        });

        // If setting as active, deactivate others first
        if (data.setAsActive) {
            await CompositeFilter.update(
                { is_active: false }, 
                { where: { id: { [Op.ne]: compositeFilter.id } } }
            );
        }

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

    async deactivateAllFilters() {
        // Deactivate all simple filters
        await Filter.update(
            { is_active: false, updated_at: new Date() },
            { where: { is_active: true } }
        );
        
        // Deactivate all composite filters
        await CompositeFilter.update(
            { is_active: false, updated_at: new Date() },
            { where: { is_active: true } }
        );
        
        console.log('All filters have been deactivated');
        return { message: 'All filters deactivated successfully' };
    }
}

export default CompositeFilterDescriptorService;

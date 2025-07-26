import { Filter, CompositeFilter } from '../models/index.js';
import { Op } from 'sequelize';

class FilterDescriptorService {
    async getFilters() {
        return await Filter.findAll();
    }

    async createFilterDescriptor(data) {
        return await Filter.create(data);
    }

    async getFilterById(id) {
        return await Filter.findByPk(id);
    }

    async updateFilterDescriptor(id, data) {
        await Filter.update(data, { where: { id } });
        return await Filter.findByPk(id);
    }

    async deleteFilterDescriptor(id) {
        return await Filter.destroy({ where: { id } });
    }

    async getActiveFilter() {
        return await Filter.findOne({ where: { is_active: true } });
    }

    async setActiveFilter(id) {
        // First, deactivate all filters (both simple and composite)
        await Filter.update(
            { is_active: false, updated_at: new Date() },
            { where: { is_active: true } }
        );
        
        await CompositeFilter.update(
            { is_active: false, updated_at: new Date() },
            { where: { is_active: true } }
        );

        // Then activate the specified filter
        await Filter.update(
            { is_active: true, updated_at: new Date() },
            { where: { id } }
        );

        return await Filter.findByPk(id);
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

export default FilterDescriptorService;
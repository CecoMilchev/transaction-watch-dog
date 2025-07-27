import { Filter } from '../models/index.js';

class FilterDescriptorService {
    constructor(kafkaProducerService) {
        this.kafkaProducerService = kafkaProducerService;
    }

    async getFilters() {
        return await Filter.findAll();
    }

    async getActiveFilters() {
        return await Filter.findAll({ where: { is_active: true } });
    }

    async createFilterDescriptor(data) {
        const filter = await Filter.create(data);
        
        await this.kafkaProducerService.publishFilterUpdate(filter);
        
        return filter;
    }

    async getFilterById(id) {
        return await Filter.findByPk(id);
    }

    async updateFilterDescriptor(id, data) {
        const oldFilter = await Filter.findByPk(id);
        if (!oldFilter) {
            return null;
        }

        await Filter.update(data, { where: { id } });
        const updatedFilter = await Filter.findByPk(id);
        
        await this.kafkaProducerService.publishFilterUpdate(updatedFilter);
        
        return updatedFilter;
    }

    async activateFilter(id) {
        const filter = await Filter.findByPk(id);
        if (!filter) {
            return null;
        }

        await Filter.update({ is_active: true }, { where: { id } });
        const updatedFilter = await Filter.findByPk(id);
        
        await this.kafkaProducerService.publishFilterUpdate(updatedFilter);
        
        return updatedFilter;
    }

    async deactivateFilter(id) {
        const filter = await Filter.findByPk(id);
        if (!filter) {
            return null;
        }

        await Filter.update({ is_active: false }, { where: { id } });
        const updatedFilter = await Filter.findByPk(id);
        
        await this.kafkaProducerService.publishFilterUpdate(updatedFilter);
        
        return updatedFilter;
    }

    async deleteFilterDescriptor(id) {
        const result = await Filter.destroy({ where: { id } });
        return result;
    }
}

export default FilterDescriptorService;
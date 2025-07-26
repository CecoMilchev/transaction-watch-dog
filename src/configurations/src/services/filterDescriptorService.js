import { Filter } from '../models/index.js';

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
}

export default FilterDescriptorService;
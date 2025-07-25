// import filterDescriptorModel from '../models/filterDescriptorModel.js';

const filterDescriptors = new Map();

export const getFilters = async () => {
    try {
        const filters = Array.from(filterDescriptors.values());
        return filters;
    } catch (error) {
        console.error('Error fetching filter descriptors:', error);
        throw new Error('Failed to fetch filter descriptors');
    }
}

export const createFilterDescriptor = async (data) => {
    const newFilterDescriptor = {
        id: filterDescriptors.size + 1,
        name: data.name,
        field: data.field,
        operator: data.operator,
        value: data.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    filterDescriptors.set(newFilterDescriptor.id, newFilterDescriptor);
    //   await filterDescriptorModel.save(newFilterDescriptor);
    return newFilterDescriptor;
};

export const getFilterById = async (id) => {
    try {
        const filter = filterDescriptors.get(parseInt(id));
        return filter || null;
    } catch (error) {
        console.error('Error fetching filter descriptor by ID:', error);
        throw new Error('Failed to fetch filter descriptor');
    }
};

export const updateFilterDescriptor = async (id, data) => {
    try {
        const filterId = parseInt(id);
        const existingFilter = filterDescriptors.get(filterId);
        
        if (!existingFilter) {
            return null;
        }

        const updatedFilter = {
            ...existingFilter,
            name: data.name || existingFilter.name,
            field: data.field || existingFilter.field,
            operator: data.operator || existingFilter.operator,
            value: data.value !== undefined ? data.value : existingFilter.value,
            updatedAt: new Date().toISOString()
        };

        filterDescriptors.set(filterId, updatedFilter);
        //   await filterDescriptorModel.update(filterId, updatedFilter);
        return updatedFilter;
    } catch (error) {
        console.error('Error updating filter descriptor:', error);
        throw new Error('Failed to update filter descriptor');
    }
};

export const deleteFilterDescriptor = async (id) => {
    try {
        const filterId = parseInt(id);
        const existingFilter = filterDescriptors.get(filterId);
        
        if (!existingFilter) {
            return false;
        }

        filterDescriptors.delete(filterId);
        //   await filterDescriptorModel.delete(filterId);
        return true;
    } catch (error) {
        console.error('Error deleting filter descriptor:', error);
        throw new Error('Failed to delete filter descriptor');
    }
};

export default {
    getFilters,
    createFilterDescriptor,
    getFilterById,
    updateFilterDescriptor,
    deleteFilterDescriptor
};
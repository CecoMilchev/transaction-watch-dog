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

export default {
    getFilters,
    createFilterDescriptor
};
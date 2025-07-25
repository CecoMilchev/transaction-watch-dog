import filterDescriptorModel from '../models/filterDescriptorModel.js';

const filterDescriptors = new Map();

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
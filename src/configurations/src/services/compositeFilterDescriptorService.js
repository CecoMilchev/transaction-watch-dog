const compositeFilterDescriptors = new Map();

export const getCompositeFilters = async () => {
    try {
        const filters = Array.from(compositeFilterDescriptors.values());
        return filters;
    } catch (error) {
        console.error('Error fetching composite filter descriptors:', error);
        throw new Error('Failed to fetch composite filter descriptors');
    }
}

export const createCompositeFilterDescriptor = async (data) => {
    const newCompositeFilterDescriptor = {
        id: compositeFilterDescriptors.size + 1,
        name: data.name,
        filters: data.filters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    compositeFilterDescriptors.set(newCompositeFilterDescriptor.id, newCompositeFilterDescriptor);
    //   await filterDescriptorModel.save(newFilterDescriptor);
    return newCompositeFilterDescriptor;
};

export default {
    getCompositeFilters,
    createCompositeFilterDescriptor
};

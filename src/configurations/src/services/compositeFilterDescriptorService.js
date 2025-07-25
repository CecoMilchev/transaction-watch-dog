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

export const getCompositeFilterById = async (id) => {
    try {
        const filter = compositeFilterDescriptors.get(parseInt(id));
        return filter || null;
    } catch (error) {
        console.error('Error fetching composite filter descriptor by ID:', error);
        throw new Error('Failed to fetch composite filter descriptor');
    }
};

export const updateCompositeFilterDescriptor = async (id, data) => {
    try {
        const filterId = parseInt(id);
        const existingFilter = compositeFilterDescriptors.get(filterId);
        
        if (!existingFilter) {
            return null;
        }

        const updatedFilter = {
            ...existingFilter,
            name: data.name || existingFilter.name,
            filters: data.filters || existingFilter.filters,
            updatedAt: new Date().toISOString()
        };

        compositeFilterDescriptors.set(filterId, updatedFilter);
        //   await compositeFilterDescriptorModel.update(filterId, updatedFilter);
        return updatedFilter;
    } catch (error) {
        console.error('Error updating composite filter descriptor:', error);
        throw new Error('Failed to update composite filter descriptor');
    }
};

export const deleteCompositeFilterDescriptor = async (id) => {
    try {
        const filterId = parseInt(id);
        const existingFilter = compositeFilterDescriptors.get(filterId);
        
        if (!existingFilter) {
            return false;
        }

        compositeFilterDescriptors.delete(filterId);
        //   await compositeFilterDescriptorModel.delete(filterId);
        return true;
    } catch (error) {
        console.error('Error deleting composite filter descriptor:', error);
        throw new Error('Failed to delete composite filter descriptor');
    }
};

export default {
    getCompositeFilters,
    createCompositeFilterDescriptor,
    getCompositeFilterById,
    updateCompositeFilterDescriptor,
    deleteCompositeFilterDescriptor
};

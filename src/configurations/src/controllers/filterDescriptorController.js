import FilterDescriptorService from '../services/filterDescriptorService.js';

const filterDescriptorService = new FilterDescriptorService();

export const getFiltersDescriptors = async (req, res) => {
    try {
        const filters = await filterDescriptorService.getFilters();
        res.status(200).json({
            success: true,
            data: filters
        });
    } catch (error) {
        console.error('Error fetching filter descriptors:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getFilterDescriptorById = async (req, res) => {
    try {
        const { id } = req.params;
        const filter = await filterDescriptorService.getFilterById(id);

        if (!filter) {
            return res.status(404).json({
                success: false,
                error: 'Filter descriptor not found'
            });
        }

        res.json({
            success: true,
            data: filter
        });
    } catch (error) {
        console.error('Error retrieving filter descriptor:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const createFilterDescriptor = async (req, res) => {
  try {
    const filterDescriptor = await filterDescriptorService.createFilterDescriptor(req.body);

    res.status(201).json({
      success: true,
      data: filterDescriptor,
      message: 'Filter descriptor created successfully'
    });
  } catch (error) {
    console.error('Error creating filter descriptor:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateFilterDescriptor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFilter = await filterDescriptorService.updateFilterDescriptor(id, req.body);

        if (!updatedFilter) {
            return res.status(404).json({
                success: false,
                error: 'Filter descriptor not found'
            });
        }

        res.json({
            success: true,
            data: updatedFilter,
            message: 'Filter descriptor updated successfully'
        });
    } catch (error) {
        console.error('Error updating filter descriptor:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const deleteFilterDescriptor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await filterDescriptorService.deleteFilterDescriptor(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Filter descriptor not found'
            });
        }

        res.json({
            success: true,
            message: 'Filter descriptor deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting filter descriptor:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getActiveFilter = async (req, res) => {
    try {
        const activeFilter = await filterDescriptorService.getActiveFilter();
        
        if (!activeFilter) {
            return res.status(404).json({
                success: false,
                message: 'No active filter found'
            });
        }

        res.json({
            success: true,
            data: activeFilter
        });
    } catch (error) {
        console.error('Error retrieving active filter:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const setActiveFilter = async (req, res) => {
    try {
        const { id } = req.params;
        const activeFilter = await filterDescriptorService.setActiveFilter(id);
        
        res.json({
            success: true,
            data: activeFilter,
            message: 'Active filter updated successfully'
        });
    } catch (error) {
        console.error('Error setting active filter:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const deactivateAllFilters = async (req, res) => {
    try {
        const result = await filterDescriptorService.deactivateAllFilters();
        
        res.json({
            success: true,
            data: result,
            message: 'All filters deactivated successfully'
        });
    } catch (error) {
        console.error('Error deactivating filters:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export default {
    getFiltersDescriptors, 
    createFilterDescriptor,
    getFilterDescriptorById,
    updateFilterDescriptor,
    deleteFilterDescriptor,
    getActiveFilter,
    setActiveFilter,
    deactivateAllFilters
};
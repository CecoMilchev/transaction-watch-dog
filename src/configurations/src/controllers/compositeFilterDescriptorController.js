import CompositeFilterDescriptorService from '../services/compositeFilterDescriptorService.js';

const compositeFilterDescriptorService = new CompositeFilterDescriptorService();

export const getCompositeFilterDescriptors = async (req, res) => {
    try {
        const filters = await compositeFilterDescriptorService.getCompositeFilters();
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

export const getCompositeFilterDescriptorById = async (req, res) => {
    try {
        const { id } = req.params;
        const composite = await compositeFilterDescriptorService.getCompositeFilterById(id);

        if (!composite) {
            return res.status(404).json({
                success: false,
                error: 'Composite filter descriptor not found'
            });
        }

        res.json({
            success: true,
            data: composite
        });
    } catch (error) {
        console.error('Error retrieving composite filter descriptor:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const createCompositeFilterDescriptor = async (req, res) => {
  try {
        const filterDescriptor = await compositeFilterDescriptorService.createCompositeFilterDescriptor(req.body);    res.status(201).json({
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

export const updateCompositeFilterDescriptor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedComposite = await compositeFilterDescriptorService.updateCompositeFilterDescriptor(id, req.body);

        if (!updatedComposite) {
            return res.status(404).json({
                success: false,
                error: 'Composite filter descriptor not found'
            });
        }

        res.json({
            success: true,
            data: updatedComposite,
            message: 'Composite filter descriptor updated successfully'
        });
    } catch (error) {
        console.error('Error updating composite filter descriptor:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const deleteCompositeFilterDescriptor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await compositeFilterDescriptorService.deleteCompositeFilterDescriptor(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Composite filter descriptor not found'
            });
        }

        res.json({
            success: true,
            message: 'Composite filter descriptor deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting composite filter descriptor:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getActiveFilter = async (req, res) => {
    try {
        const activeFilter = await compositeFilterDescriptorService.getActiveCompositeFilter();
        
        if (!activeFilter) {
            return res.status(404).json({
                success: false,
                message: 'No active composite filter found'
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
        const activeFilter = await compositeFilterDescriptorService.setActiveCompositeFilter(id);
        
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
        const result = await compositeFilterDescriptorService.deactivateAllFilters();
        
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
    getCompositeFilterDescriptors,
    createCompositeFilterDescriptor,
    getCompositeFilterDescriptorById,
    updateCompositeFilterDescriptor,
    deleteCompositeFilterDescriptor,
    getActiveFilter,
    setActiveFilter,
    deactivateAllFilters
};
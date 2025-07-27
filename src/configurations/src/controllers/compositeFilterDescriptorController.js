import container from '../container.js';

const compositeFilterDescriptorService = container.resolve('compositeFilterDescriptorService');

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

export const activateCompositeFilterDescriptor = async (req, res) => {
    try {
        const { id } = req.params;
        const activatedFilter = await compositeFilterDescriptorService.activateCompositeFilter(id);

        if (!activatedFilter) {
            return res.status(404).json({
                success: false,
                error: 'Composite filter descriptor not found'
            });
        }

        res.json({
            success: true,
            data: activatedFilter,
            message: 'Composite filter descriptor activated successfully'
        });
    } catch (error) {
        console.error('Error activating composite filter descriptor:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const deactivateCompositeFilterDescriptor = async (req, res) => {
    try {
        const { id } = req.params;
        const deactivatedFilter = await compositeFilterDescriptorService.deactivateCompositeFilter(id);

        if (!deactivatedFilter) {
            return res.status(404).json({
                success: false,
                error: 'Composite filter descriptor not found'
            });
        }

        res.json({
            success: true,
            data: deactivatedFilter,
            message: 'Composite filter descriptor deactivated successfully'
        });
    } catch (error) {
        console.error('Error deactivating composite filter descriptor:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getActiveCompositeFilterDescriptors = async (req, res) => {
    try {
        const filters = await compositeFilterDescriptorService.getActiveCompositeFilters();
        res.status(200).json({
            success: true,
            data: filters
        });
    } catch (error) {
        console.error('Error fetching active composite filter descriptors:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export default {
    getCompositeFilterDescriptors,
    createCompositeFilterDescriptor,
    getCompositeFilterDescriptorById,
    updateCompositeFilterDescriptor,
    deleteCompositeFilterDescriptor,
    activateCompositeFilterDescriptor,
    deactivateCompositeFilterDescriptor,
    getActiveCompositeFilterDescriptors
};
import compositeFilterDescriptorService from '../services/compositeFilterDescriptorService.js';

export const getCompositeFilterDescriptors = async (req, res) => {
    try {
        const filters = await compositeFilterDescriptorService.getFilters();
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

export const getCompositeFilterDescriptorById = async (req, res) => {}

export const createCompositeFilterDescriptor = async (req, res) => {
  try {
    const filterDescriptor = await compositeFilterDescriptorService.createFilterDescriptor(req.body);

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

export const updateCompositeFilterDescriptor = async (req, res) => {}

export const deleteCompositeFilterDescriptor = async (req, res) => {}

export default {
    getCompositeFilterDescriptors,
    createCompositeFilterDescriptor,
    getCompositeFilterDescriptorById,
    updateCompositeFilterDescriptor,
    deleteCompositeFilterDescriptor
};
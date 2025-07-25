import filterDescriptorService from '../services/filterDescriptorService.js';

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

export const getFilterDescriptorById = async (req, res) => {}

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

export const updateFilterDescriptor = async (req, res) => {}

export const deleteFilterDescriptor = async (req, res) => {}

export default {
    getFiltersDescriptors, 
    createFilterDescriptor,
    getFilterDescriptorById,
    updateFilterDescriptor,
    deleteFilterDescriptor
};
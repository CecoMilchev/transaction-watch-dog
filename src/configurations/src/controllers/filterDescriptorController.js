import filterDescriptorService from '../services/filterDescriptorService.js';

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
import express from 'express';
import compositeFilterDescriptorController from '../controllers/compositeFilterDescriptorController.js';
import {
  validateRequestBodyMiddleware,
  validateUUIDParamMiddleware
} from '../middleware/validateRequestBodyMiddleware.js';

const router = express.Router();

router.get(
  '/composite-filters',
  compositeFilterDescriptorController.getCompositeFilterDescriptors
);

router.get(
  '/composite-filters/:id',
  compositeFilterDescriptorController.getCompositeFilterDescriptorById
);

router.post(
  '/composite-filters',
  validateRequestBodyMiddleware(),
  //   validateFilterDescriptorMiddleware(),
  compositeFilterDescriptorController.createCompositeFilterDescriptor
);

router.put(
  '/composite-filters/:id',
  validateRequestBodyMiddleware(),
  // validateUUIDParamMiddleware(),
  //   validateFilterDescriptorMiddleware(),
  compositeFilterDescriptorController.updateCompositeFilterDescriptor
);

router.delete(
  '/composite-filters/:id',
  validateRequestBodyMiddleware(),
  // validateUUIDParamMiddleware(),
  compositeFilterDescriptorController.deleteCompositeFilterDescriptor
);

// Active filter endpoints
router.get(
  '/composite-filters/active',
  compositeFilterDescriptorController.getActiveFilter
);

router.put(
  '/composite-filters/:id/activate',
  compositeFilterDescriptorController.setActiveFilter
);

router.put(
  '/composite-filters/deactivate',
  compositeFilterDescriptorController.deactivateAllFilters
);

export default router;
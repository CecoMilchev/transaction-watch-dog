import express from 'express';
import compositeFilterDescriptorController from '../controllers/compositeFilterDescriptorController.js';

const router = express.Router();

router.get(
  '/composite-filters',
  //   validateRequestBodyMiddleware(),
  //   validateFilterDescriptorMiddleware(),
  compositeFilterDescriptorController.getCompositeFilterDescriptors
);

router.get(
  '/composite-filters/:id',
  //   validateRequestBodyMiddleware(),
  //   validateFilterDescriptorMiddleware(),
  compositeFilterDescriptorController.getCompositeFilterDescriptorById
);

router.post(
  '/composite-filters',
  //   validateRequestBodyMiddleware(),
  //   validateFilterDescriptorMiddleware(),
  compositeFilterDescriptorController.createCompositeFilterDescriptor
);

router.put(
  '/composite-filters/:id',
  //   validateRequestBodyMiddleware(),
  //   validateFilterDescriptorMiddleware(),
  compositeFilterDescriptorController.updateCompositeFilterDescriptor
);

router.delete(
  '/composite-filters/:id',
  //   validateUUIDParamMiddleware(),
  //   validateRequestBodyMiddleware(),
  //   validateFilterDescriptorMiddleware(),
  compositeFilterDescriptorController.deleteCompositeFilterDescriptor
);

export default router;
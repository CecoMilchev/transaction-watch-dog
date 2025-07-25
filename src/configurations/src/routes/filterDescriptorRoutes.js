import express from 'express';
import filterdescriptorController from '../controllers/filterDescriptorController.js';
const router = express.Router();

router.get(
    '/filters',
    //   validateRequestBodyMiddleware(),
    //   validateFilterDescriptorMiddleware(),
    filterdescriptorController.getFiltersDescriptors
);

router.get(
    '/filters/:id',
    //   validateRequestBodyMiddleware(),
    //   validateFilterDescriptorMiddleware(),
    filterdescriptorController.getFilterDescriptorById
);

router.post(
    '/filters',
    //   validateRequestBodyMiddleware(),
    //   validateFilterDescriptorMiddleware(),
    filterdescriptorController.createFilterDescriptor
);

router.put('/filters/:id',
    //   validateRequestBodyMiddleware(),
    //   validateFilterDescriptorMiddleware(),
    filterdescriptorController.updateFilterDescriptor
);

router.delete('/filters/:id',
    //   validateUUIDParamMiddleware(),
    //   validateRequestBodyMiddleware(),
    //   validateFilterDescriptorMiddleware(),
    filterdescriptorController.deleteFilterDescriptor
);

export default router;
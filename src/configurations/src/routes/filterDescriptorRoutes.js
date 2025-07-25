import express from 'express';
import filterdescriptorController from '../controllers/filterDescriptorController.js';
import {
    validateRequestBodyMiddleware,
    validateUUIDParamMiddleware
} from '../middleware/validateRequestBodyMiddleware.js';

const router = express.Router();

router.get(
    '/filters',
    //   validateFilterDescriptorMiddleware(),
    filterdescriptorController.getFiltersDescriptors
);

router.get(
    '/filters/:id',
    validateRequestBodyMiddleware(),
    // validateUUIDParamMiddleware(),
    filterdescriptorController.getFilterDescriptorById
);

router.post(
    '/filters',
    validateRequestBodyMiddleware(),
    //   validateFilterDescriptorMiddleware(),
    filterdescriptorController.createFilterDescriptor
);

router.put('/filters/:id',
    validateRequestBodyMiddleware(),
    // validateUUIDParamMiddleware(),
    //   validateFilterDescriptorMiddleware(),
    filterdescriptorController.updateFilterDescriptor
);

router.delete('/filters/:id',
    validateRequestBodyMiddleware(),
    // validateUUIDParamMiddleware(),
    filterdescriptorController.deleteFilterDescriptor
);

export default router;
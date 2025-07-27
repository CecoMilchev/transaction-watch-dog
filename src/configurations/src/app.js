import express from 'express';
import container from './container.js';
import filterDescriptorRoutes from './routes/filterDescriptorRoutes.js';
import compositeFilterDescriptorRoutes from './routes/compositeFilterDescriptorRoutes.js';

(async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    // Initialize kafka producer service
    const kafkaProducerService = container.resolve('kafkaProducerService');
    await kafkaProducerService.connect();

    app.use(express.json());
    app.use('/api', filterDescriptorRoutes);
    app.use('/api', compositeFilterDescriptorRoutes);

    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });

    app.listen(port, () => {
        console.log(`\nConfiguration service listening on port ${port}!\n`);
    });
})().catch(console.error);

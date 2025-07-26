import 'dotenv/config';
import { sequelize, Filter, CompositeFilter, CompositeFilterRule } from '../models/index.js';

(async () => {
    try {
        await sequelize.authenticate();

        await Filter.sync({ force: false });
        await CompositeFilter.sync({ force: false });
        await CompositeFilterRule.sync({ force: false });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
        console.log('🔐 Database connection closed.');
    }
})();

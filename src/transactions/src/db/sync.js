import 'dotenv/config';
import { sequelize, FilteredTransaction } from '../models/index.js';

(async () => {
    try {
        await sequelize.authenticate();
        const force = process.argv.includes('--force');
        await FilteredTransaction.sync({ force });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
})();

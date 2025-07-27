import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'transactions_db',
    process.env.DB_USER || 'transactions_user',
    process.env.DB_PASSWORD || 'transactions_password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3307,
        dialect: 'mysql',
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
);

export default sequelize;

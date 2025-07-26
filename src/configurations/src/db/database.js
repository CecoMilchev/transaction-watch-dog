import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'configurations_db',
    process.env.DB_USER || 'config_user',
    process.env.DB_PASSWORD || 'config_password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
);

export default sequelize;

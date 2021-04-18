import { config } from 'dotenv';

config();

export default {
    port: process.env.port || 3000,
    database: {
        dialect: process.env.DATABASE_DIALECT || 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        dbName: process.env.DATABASE_DB_NAME || 'postgres',
        user: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || ''
    }
};
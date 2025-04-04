import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 8080,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    SERVICES: {
        AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
        USERS: process.env.USERS_SERVICE_URL || 'http://localhost:8083/user',
        EDITOR: process.env.EDITOR_SERVICE_URL || 'http://localhost:8082',
        LOGS: process.env.LOGS_SERVICE_URL || 'http://localhost:3006'
    },
    PUBLIC_ROUTES: [
        '/user',
        '/auth/login',
        '/auth/register',
        '/healthcheck'
    ]
};
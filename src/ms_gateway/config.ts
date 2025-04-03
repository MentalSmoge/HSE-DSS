import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 8080,
    JWT_SECRET: process.env.JWT_SECRET || 'your_default_jwt_secret',
    SERVICES: {
        AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
        USERS: process.env.USERS_SERVICE_URL || 'http://localhost:8083',
        EDITOR: process.env.EDITOR_SERVICE_URL || 'http://localhost:8082',
        LOGS: process.env.LOGS_SERVICE_URL || 'http://localhost:3006'
    },
    PUBLIC_ROUTES: [
        '/auth/login',
        '/auth/register',
        '/healthcheck'
    ]
};
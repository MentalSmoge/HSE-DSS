import express from 'express';
import { PostgreSQLUserRepository, createPool } from './infrastructure/userdb_repository';
import { UserService } from './application/user_service';
import { createUserRouter } from './framework/routes';
const port = process.env.PORT || 8080;

async function bootstrap() {
    const app = express();
    app.use(express.json());

    // Инициализация зависимостей
    const pool = createPool();
    const userRepository = new PostgreSQLUserRepository(pool);
    const userService = new UserService(userRepository);

    // Подключение роутов
    app.use('/api', createUserRouter(userService));

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

bootstrap();
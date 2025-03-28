import express from "express";
import cors from "cors";
import {
	createPool,
	PostgreSQLUserRepository,
} from "./infrastructure/userdb_repository";
import { UserService } from "./application/user_service";
import { createUserRouter } from "./framework/routes";
import { redisClient } from "./infrastructure/redis_client";

const port = process.env.USERS_PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());
//sas15
async function startUsersServer() {
	// Инициализация PostgreSQL
	const pool = createPool();
	const userRepository = new PostgreSQLUserRepository(pool);

	// Сервисы
	const userService = new UserService(userRepository, redisClient);

	app.use("/user", createUserRouter(userService));

	// Запуск сервера
	app.listen(port, () => console.log(`Users server running on port ${port}`));
}

startUsersServer().catch((err) => {
	console.error("Failed to start users server:", err);
});

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as r from "rethinkdb";
import { RethinkDBElementRepository } from "./infrastructure/rethinkdb_repository";
import { ElementService } from "./application/element_service";
import { UserService } from "./application/user_service";
import { createPool, PostgreSQLUserRepository } from "./infrastructure/userdb_repository";
import { createUserRouter } from "./framework/routes";
import { WebSocketController } from "./framework/websocket_controller";

const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

async function startServer() {
    // Инициализация RethinkDB
    const rethinkConnection = await r.connect({
        host: process.env.RETHINKDB_HOST || "localhost",
        port: process.env.RETHINKDB_PORT ? Number(process.env.RETHINKDB_PORT) : 28015,
    });

    // Репозитории
    const elementRepository = new RethinkDBElementRepository(rethinkConnection);
    const pool = createPool();
    const userRepository = new PostgreSQLUserRepository(pool);

    // Сервисы
    const elementService = new ElementService(elementRepository);
    const userService = new UserService(userRepository);

    // Инициализация сервисов
    await elementService.initialize();

    // REST API
    app.use("/api", createUserRouter(userService));

    // WebSocket
    new WebSocketController(io, elementService);

    // Запуск сервера
    server.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer().catch((err) => {
    console.error("Failed to start server:", err);
});
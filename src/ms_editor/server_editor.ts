import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as r from "rethinkdb";
import { RethinkDBElementRepository } from "./infrastructure/elements_repository";
import { ElementService } from "./application/element_service";
import { WebSocketController } from "./framework/websocket_controller";

const port = process.env.EDITOR_PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

async function startEditorServer() {
	// Инициализация RethinkDB
	const rethinkConnection = await r.connect({
		host: process.env.RETHINKDB_HOST || "localhost",
		port: process.env.RETHINKDB_PORT
			? Number(process.env.RETHINKDB_PORT)
			: 28015,
	});

	// Репозитории
	const elementRepository = new RethinkDBElementRepository(rethinkConnection);

	// Сервисы
	const elementService = new ElementService(elementRepository);

	// Инициализация сервисов
	await elementService.initialize();

	// WebSocket
	new WebSocketController(io, elementService);

	// Запуск сервера
	server.listen(port, () =>
		console.log(`Editor server running on port ${port}`)
	);
}

startEditorServer().catch((err) => {
	console.error("Failed to start editor server:", err);
});

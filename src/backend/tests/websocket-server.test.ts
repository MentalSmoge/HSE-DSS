import { Server } from "socket.io";
import http from "http";
import ioClient, { Socket } from "socket.io-client";
import { WebSocketController } from "../framework/websocket_controller";
import { ElementService } from "../application/element_service";
import { RethinkDBElementRepository } from "../infrastructure/rethinkdb_repository";
import * as r from "rethinkdb";

describe("WebSocketController Integration Tests", () => {
    let server: http.Server;
    let io: Server;
    let clientSocket: Socket;
    let elementService: ElementService;
    let rethinkConnection: r.Connection;

    beforeAll(async () => {
        // Инициализация сервера и WebSocket
        const app = http.createServer();
        io = new Server(app);

        // Подключение к RethinkDB
        rethinkConnection = await r.connect({
            host: process.env.RETHINKDB_HOST || "localhost",
            port: process.env.RETHINKDB_PORT ? Number(process.env.RETHINKDB_PORT) : 28015,
        });

        // Инициализация репозитория и сервиса
        const elementRepository = new RethinkDBElementRepository(rethinkConnection);
        elementService = new ElementService(elementRepository);
        await elementService.initialize();

        // Инициализация WebSocketController
        new WebSocketController(io, elementService);

        // Запуск сервера
        server = app.listen(3000, () => {
            // Подключение клиента
            clientSocket = ioClient("http://localhost:3000");
            clientSocket.on("connect", () => { console.log("Client connected"); });
        });
    });

    afterAll((done) => {
        // Закрытие соединений
        clientSocket.disconnect();
        io.close();
        server.close(() => {
            rethinkConnection.close().then(done);
        });
    });

    it("should send initial board state on connection", (done) => {
        clientSocket.on("board-state", (elements) => {
            expect(elements).toBeDefined();
            expect(Array.isArray(elements)).toBe(true);
            done();
        });
    });

    it("should handle element creation", (done) => {
        const newElement = { id: "-1", name: "Test Element" };

        clientSocket.on("element-created", (element) => {
            expect(element).toEqual(newElement);
            done();
        });

        clientSocket.emit("element-create", newElement);
    });

    it("should handle element update", (done) => {
        const updatedElement = { id: "-1", name: "Updated Element" };

        clientSocket.on("element-updated", (element) => {
            expect(element).toEqual(updatedElement);
            done();
        });

        clientSocket.emit("element-update", updatedElement);
    });

    it("should handle element deletion", (done) => {
        const elementId = "-1";

        clientSocket.on("element-deleted", (deletedElementId) => {
            expect(deletedElementId).toBe(elementId);
            done();
        });

        clientSocket.emit("element-delete", elementId);
    });
});
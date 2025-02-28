import http from "http";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import { WebSocketController } from "../framework/websocket_controller";
import { ElementService } from "../application/element_service";
import { RethinkDBElementRepository } from "../infrastructure/elements_repository";
import * as r from "rethinkdb";
import { AddressInfo } from "node:net";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}
describe("WebSocketController Integration Tests", () => {
    let server: http.Server;
    let io: Server;
    let clientSocket: ClientSocket;
    let serverSocket: ServerSocket;
    let elementService: ElementService;
    let rethinkConnection: r.Connection;

    beforeAll(async () => {
        // Подключение к RethinkDB
        rethinkConnection = await r.connect({
            host: "localhost",
            port: 28015,
        });

        // Инициализация сервера и WebSocket
        const app = http.createServer();
        io = new Server(app);

        // Инициализация репозитория и сервиса
        const elementRepository = new RethinkDBElementRepository(rethinkConnection);
        elementService = new ElementService(elementRepository);
        await elementService.initialize();

        new WebSocketController(io, elementService);

        const httpServer = http.createServer();
        io = new Server(httpServer);
        await new Promise<void>((resolve) => {
            httpServer.listen(() => {
                const port = (httpServer.address() as AddressInfo).port;
                clientSocket = ioc(`http://localhost:${port}`);
                console.log(port);
                io.on("connection", (socket) => {
                    serverSocket = socket;
                });
                clientSocket.on("connect", () => {
                    console.log("Client connected");
                    resolve(); // Разрешаем Promise, когда клиент подключится
                });
            });
        });

    });

    afterAll(async () => {
        clientSocket.disconnect();
        io.close();
        await rethinkConnection.close();
    });

    test("should send initial board state on connection", (done) => {
        clientSocket.on("board-state", (elements: any) => {
            expect(elements).toBeDefined();
            expect(Array.isArray(elements)).toBe(true);
            done();
        });
        serverSocket.emit("board-state", [{ id: "1", name: "Test Element" }]);
    }, 2000);

    test("should handle element creation", (done) => {
        const newElement = { id: "1", name: "Test Element" };

        serverSocket.on("element-create", (element: any) => {
            expect(element).toEqual(newElement);
            done();
        });

        clientSocket.emit("element-create", newElement);
    }, 2000);

    test("should handle element update", (done) => {
        const updatedElement = { id: "1", name: "Updated Element" };

        serverSocket.on("element-update", (element: any) => {
            expect(element).toEqual(updatedElement);
            done();
        });

        clientSocket.emit("element-update", updatedElement);

    }, 2000);

    test("should handle element deletion", (done) => {
        const elementId = "1";

        serverSocket.on("element-delete", (deletedElementId: string) => {
            expect(deletedElementId).toBe(elementId);
            done();
        });

        clientSocket.emit("element-delete", elementId);
    }, 2000);
});
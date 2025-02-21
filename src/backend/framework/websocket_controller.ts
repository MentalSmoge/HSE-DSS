import { Server, Socket } from "socket.io";
import { ElementService, ElementDTO } from "../application/element_service";

export class WebSocketController {
    constructor(
        private io: Server,
        private elementService: ElementService
    ) {
        this.setupHandlers();
    }

    private setupHandlers(): void {
        this.io.on("connection", (socket: Socket) => {
            console.log("User connected:", socket.id);

            // Отправка текущего состояния
            socket.emit("board-state", this.elementService.getElements());

            // Создание элемента
            socket.on("element-create", async (element: ElementDTO) => {
                await this.elementService.createElement(element);
                this.io.emit("element-created", element);
            });

            // Обновление элемента
            socket.on("element-update", async (element: ElementDTO) => {
                await this.elementService.updateElement(element);
                this.io.emit("element-updated", element);
            });

            // Удаление элемента
            socket.on("element-delete", async (elementId: string) => {
                await this.elementService.deleteElement(elementId);
                this.io.emit("element-deleted", elementId);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }
}
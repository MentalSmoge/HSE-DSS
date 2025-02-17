import { Server, Socket } from "socket.io";
import { Element } from "../domain/element";
import { ElementService } from "../application/element_service";

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
            socket.on("element-create", async (element: Element) => {
                await this.elementService.createElement(element);
                this.io.emit("element-created", element);
            });

            // Обновление элемента
            socket.on("element-update", async (element: Element) => {
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
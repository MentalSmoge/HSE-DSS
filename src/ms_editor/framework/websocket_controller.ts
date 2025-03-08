import { Server, Socket } from "socket.io";
import { sendBoardUpdate } from "../kafka";
import { ElementService, ElementDTO } from "../application/element_service";

export class WebSocketController {
	constructor(private io: Server, private elementService: ElementService) {
		this.setupHandlers();
	}

	private setupHandlers(): void {
		this.io.on("connection", (socket: Socket) => {
			console.log("User connected:", socket.id);
			sendBoardUpdate({
				type: "USER_CONNECTED",
				payload: socket.id,
			});

			// Отправка текущего состояния
			socket.emit("board-state", this.elementService.getElements());

			// Создание элемента
			socket.on("element-create", async (element: ElementDTO) => {
				await this.elementService.createElement(element);
				this.io.emit("element-created", element);
				// Пример использования
				sendBoardUpdate({
					type: "ELEMENT_CREATED",
					payload: element,
				});
			});

			// Обновление элемента
			socket.on("element-update", async (element: ElementDTO) => {
				await this.elementService.updateElement(element);
				this.io.emit("element-updated", element);
				sendBoardUpdate({
					type: "ELEMENT_UPDATED",
					payload: element,
				});
			});

			// Удаление элемента
			socket.on("element-delete", async (elementId: string) => {
				await this.elementService.deleteElement(elementId);
				this.io.emit("element-deleted", elementId);
				sendBoardUpdate({
					type: "ELEMENT_DELETED",
					payload: elementId,
				});
			});

			socket.on("disconnect", () => {
				console.log("User disconnected:", socket.id);
				sendBoardUpdate({
					type: "USER_DISCONNECTED",
					payload: socket.id,
				});
			});
		});
	}
}

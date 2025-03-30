import { io } from "socket.io-client";

const port = process.env.PORT_SOCKET || 8082;
const URL =
	process.env.NODE_ENV === "production"
		? undefined
		: `http://localhost:${port}`;

export const socket = io(URL, {
	autoConnect: false, // Отключаем автоматическое подключение
	reconnectionAttempts: 5, // Количество попыток переподключения
	reconnectionDelay: 1000, // Задержка между попытками
});
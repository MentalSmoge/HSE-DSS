import { io } from "socket.io-client";
const port = process.env.PORT_SOCKET || 8082;
// "undefined" means the URL will be computed from the `window.location` object
const URL =
	process.env.NODE_ENV === "production"
		? undefined
		: `http://localhost:${port}`;

export const socket = io(URL);

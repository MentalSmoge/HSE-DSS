const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Store whiteboard state in memory (replace with DB later)
let elements = [];

io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	// Send current state to new user
	socket.emit("board-state", elements);

	socket.on("debug-print-elements", () => {
		elements.forEach((element) => {
			console.log(element.id);
		});
	});
	socket.on("element-create", (element) => {
		console.log("element-create:", element);
		elements.push(element);
		// Broadcast the new element to all users
		io.emit("element-created", element);
	});

	// Update: Modify an existing element
	socket.on("element-update", (element) => {
		console.log("element-updated:", element);
		elements = elements.map((el) => (el.id === element.id ? element : el));
		// Broadcast the updated element to all users
		io.emit("element-updated", element);
	});

	// Delete: Remove an element
	socket.on("element-delete", (elementId) => {
		console.log("element-delete:", elementId);
		elements = elements.filter((el) => el.id !== elementId);
		// Broadcast the deleted element ID to all users
		io.emit("element-deleted", elementId);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});
server.listen(port, () => console.log(`Server running on port ${port}`));

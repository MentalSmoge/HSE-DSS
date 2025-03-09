const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Pool } = require("pg");
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Store whiteboard state in memory (replace with DB later)
let elements = [];

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST || "user_db", // 'db' is the service name in docker-compose
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT || 5432,
});
pool.query("SELECT NOW()", (err, res) => {
	if (err) console.error("Database connection error:", err);
	else console.log("Database connected:", res.rows[0]);
});

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

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as r from "rethinkdb";

const port = process.env.PORT || 8081;
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rethinkConfig = {
    host: process.env.RETHINKDB_HOST || "localhost",
    port: process.env.RETHINKDB_PORT ? Number(process.env.RETHINKDB_PORT) : 28015,
    db: process.env.RETHINKDB_NAME || "rethink",
    table: "elements",
};

let rethinkConn: r.Connection;

async function initializeRethinkDB() {
    try {
        rethinkConn = await r.connect(rethinkConfig);

        // Создаем базу данных и таблицу, если их нет
        const dbList = await r.dbList().run(rethinkConn);
        if (!dbList.includes(rethinkConfig.db)) {
            await r.dbCreate(rethinkConfig.db).run(rethinkConn);
        }

        const tableList = await r.db(rethinkConfig.db).tableList().run(rethinkConn);
        if (!tableList.includes(rethinkConfig.table)) {
            await r.db(rethinkConfig.db).tableCreate(rethinkConfig.table).run(rethinkConn);
        }

        console.log("RethinkDB connected and initialized");
    } catch (err) {
        console.error("RethinkDB connection error:", err);
    }
}

// Инициализация RethinkDB
initializeRethinkDB();

// Состояние доски (в памяти, если RethinkDB недоступен)
let elements: any[] = [];

// Загрузка начального состояния из RethinkDB
async function loadInitialState() {
    try {
        const cursor = await r.db(rethinkConfig.db).table(rethinkConfig.table).run(rethinkConn);
        elements = await cursor.toArray();
        console.log("Initial state loaded from RethinkDB");
    } catch (err) {
        console.error("Failed to load initial state from RethinkDB:", err);
    }
}

// Сохранение элемента в RethinkDB
async function saveElement(element: any) {
    try {
        await r.db(rethinkConfig.db).table(rethinkConfig.table).insert(element, { conflict: "replace" }).run(rethinkConn);
    } catch (err) {
        console.error("Failed to save element to RethinkDB:", err);
    }
}

// Удаление элемента из RethinkDB
async function deleteElement(elementId: string) {
    try {
        await r.db(rethinkConfig.db).table(rethinkConfig.table).get(elementId).delete().run(rethinkConn);
    } catch (err) {
        console.error("Failed to delete element from RethinkDB:", err);
    }
}

// WebSocket соединения
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Отправка текущего состояния новому пользователю
    socket.emit("board-state", elements);

    // Отладка: вывод всех элементов
    socket.on("debug-print-elements", () => {
        elements.forEach((element) => {
            console.log(element.id);
        });
    });

    // Создание нового элемента
    socket.on("element-create", async (element) => {
        console.log("element-create:", element);
        elements.push(element);
        await saveElement(element);
        io.emit("element-created", element);
    });

    // Обновление существующего элемента
    socket.on("element-update", async (element) => {
        console.log("element-updated:", element);
        elements = elements.map((el) => (el.id === element.id ? element : el));
        await saveElement(element);
        io.emit("element-updated", element);
    });

    // Удаление элемента
    socket.on("element-delete", async (elementId) => {
        console.log("element-delete:", elementId);
        elements = elements.filter((el) => el.id !== elementId);
        await deleteElement(elementId);
        io.emit("element-deleted", elementId);
    });

    // Отключение пользователя
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Загрузка начального состояния при запуске сервера
loadInitialState();

// Запуск сервера
server.listen(port, () => console.log(`Server running on port ${port}`));
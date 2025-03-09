// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const Joi = require("joi");

// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(bodyParser.json());

// let users = [{ id: 1, name: "sample name" }];
// let projects = [{ id: 2, owner_id: 1, title: "sample title" }];
// let boards = [{ id: 123, project_id: 2, title: "sample board" }];
// let board_elements = [
// 	{ id: 6123123, board_id: 123, type: 0, pos_x: 13.62, pos_y: 111.15 },
// ];
// // #region Валидации
// const userSchema = Joi.object({
// 	name: Joi.string().min(3).required(),
// });
// // Схема валидации для проекта
// const projectSchema = Joi.object({
// 	owner_id: Joi.required(),
// 	title: Joi.string().min(3).required(),
// });
// // Схема валидации для доски
// const boardSchema = Joi.object({
// 	project_id: Joi.required(),
// 	title: Joi.string().min(3).required(),
// });
// // Схема валидации для доски
// const boardSchemaPut = Joi.object({
// 	project_id: Joi.required(),
// 	title: Joi.string().min(3).required(),
// });
// // Схема валидации для элемента
// const boardElementSchema = Joi.object({
// 	type: Joi.number().required(),
// 	pos_x: Joi.number().required(),
// 	pos_y: Joi.number().required(),
// });
// const boardElementSchemaPut = Joi.object({
// 	type: Joi.number(),
// 	pos_x: Joi.number(),
// 	pos_y: Joi.number(),
// });
// // #endregion
// // #region users
// // Создание пользователя
// app.post("/users", (req, res) => {
// 	const { error } = userSchema.validate(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);
// 	const newUser = { id: users.length + 1, ...req.body };
// 	users.push(newUser);
// 	res.status(201).json(newUser);
// });
// // Получение пользователя
// app.get("/users/:id", (req, res) => {
// 	const user = users.find((b) => b.id === parseInt(req.params.id));
// 	if (!user) return res.status(404).send("User not found");
// 	res.status(200).json(user);
// });
// // #endregion
// // #region projects
// // Создание нового проекта
// app.post("/projects", (req, res) => {
// 	const { error } = projectSchema.validate(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);
// 	const newProject = { id: projects.length + 1, ...req.body };
// 	projects.push(newProject);
// 	res.status(201).json(newProject);
// });
// // Получение проекта по ID
// app.get("/projects/:id", (req, res) => {
// 	const project = projects.find((b) => b.id === parseInt(req.params.id));
// 	if (!project) return res.status(404).send("Project not found");
// 	res.status(200).json(project);
// });
// // #endregion
// // #region boards
// // Создание доски
// app.post("/boards", (req, res) => {
// 	const { error } = boardSchema.validate(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);
// 	const newBoard = { id: boards.length + 1, ...req.body };
// 	boards.push(newBoard);
// 	res.status(201).json(newBoard);
// });

// // Получение доски по ID
// app.get("/boards/:id", (req, res) => {
// 	const board = boards.find((b) => b.id === parseInt(req.params.id));
// 	if (!board) return res.status(404).send("Board not found");
// 	res.status(200).json(board);
// });
// // Обновление доски
// app.put("/boards/:id", (req, res) => {
// 	const { error } = boardSchema.validate(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);
// 	const board = boards.find((b) => b.id === parseInt(req.params.id));
// 	if (!board) return res.status(404).send("Board not found");
// 	Object.assign(board, req.body);
// 	res.json(board);
// });
// // Удаление доски
// app.delete("/boards/:id", (req, res) => {
// 	const boardIndex = boards.findIndex(
// 		(b) => b.id === parseInt(req.params.id)
// 	);
// 	if (boardIndex === -1) return res.status(404).send("Board not found");
// 	boards.splice(boardIndex, 1);
// 	res.status(204).send();
// });
// // #endregion
// // #region invitations
// // // Создание приглашения
// // app.post("/invitations", (req, res) => {
// // 	const newInvitation = { id: invitations.length + 1, ...req.body };
// // 	invitations.push(newInvitation);
// // 	res.status(201).json(newInvitation);
// // });

// // // Получение всех приглашений
// // app.get("/invitations", (req, res) => {
// // 	res.json(invitations);
// // });
// // // #endregion
// // #region board elements
// // Добавление элемента на доску
// app.post("/boards/:id/elements", (req, res) => {
// 	const { error } = boardElementSchema.validate(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);
// 	const board = boards.find((b) => b.id === parseInt(req.params.id));
// 	if (!board) return res.status(404).send("Board not found");
// 	const elements = board_elements.find(
// 		(b) => b.board_id === parseInt(req.params.id)
// 	);
// 	if (!elements) elements = [];

// 	const newElement = {
// 		id: board_elements.length + 1,
// 		board_id: parseInt(req.params.id),
// 		...req.body,
// 	};
// 	board_elements.push(newElement);
// 	res.status(201).json(newElement);
// });

// // Получение элементов доски
// app.get("/boards/:id/elements", (req, res) => {
// 	const board = boards.find((b) => b.id === parseInt(req.params.id));
// 	if (!board) return res.status(404).send("Board not found");
// 	const elements = board_elements.filter(
// 		(b) => b.board_id === parseInt(req.params.id)
// 	);
// 	console.log(board_elements);
// 	console.log(elements);
// 	res.status(200).json(elements || []);
// });

// // Получение элемента доски
// app.get("/boards/:id/elements/:elementId", (req, res) => {
// 	const board = boards.find((b) => b.id === parseInt(req.params.id));
// 	if (!board) return res.status(404).send("Board not found");
// 	const elements = board_elements.find(
// 		(b) =>
// 			b.board_id === parseInt(req.params.id) &&
// 			b.id === parseInt(req.params.elementId)
// 	);
// 	console.log(board_elements);
// 	console.log(elements);
// 	res.status(200).json(elements || []);
// });

// // Удаление элемента с доски
// app.delete("/boards/:id/elements/:elementId", (req, res) => {
// 	const board = boards.find((b) => b.id === parseInt(req.params.id));
// 	if (!board) return res.status(404).send("Board not found");
// 	const elements = board_elements.find(
// 		(b) => b.board_id === parseInt(req.params.id)
// 	);
// 	if (!board_elements) board_elements = [];
// 	const elementIndex = board_elements.findIndex(
// 		(e) => e.id === parseInt(req.params.elementId)
// 	);
// 	if (elementIndex === -1)
// 		return res.status(404).send("Board Element not found");
// 	board_elements.splice(elementIndex, 1);
// 	res.status(204).json(board_elements);
// });

// // Передвижение элемента
// app.put("/boards/:id/elements/:elementId", (req, res) => {
// 	const { error } = boardElementSchemaPut.validate(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);
// 	const board = boards.find((b) => b.id === parseInt(req.params.id));
// 	if (!board) return res.status(404).send("Board not found");
// 	const elements = board_elements.filter(
// 		(b) => b.board_id === parseInt(req.params.id)
// 	);
// 	if (!elements) elements = [];
// 	const elementIndex = elements.findIndex(
// 		(e) => e.id === parseInt(req.params.elementId)
// 	);
// 	if (elementIndex === -1)
// 		return res.status(404).send("Board Element not found");
// 	if (req.body.type !== undefined) {
// 		board_elements[elementIndex].type = parseFloat(req.body.type);
// 	}
// 	if (req.body.pos_x !== undefined) {
// 		board_elements[elementIndex].pos_x = parseFloat(req.body.pos_x);
// 	}
// 	if (req.body.pos_y !== undefined) {
// 		board_elements[elementIndex].pos_y = parseFloat(req.body.pos_y);
// 	}
// 	res.status(200).json(board_elements[elementIndex]);
// });
// // #endregion

// app.listen(PORT, () => {
// 	console.log(`Сервер запущен на http://localhost:${PORT}`);
// });

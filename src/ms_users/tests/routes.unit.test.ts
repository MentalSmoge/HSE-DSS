import request from "supertest";
import express from "express";
import { createUserRouter } from "../framework/routes";
import { UserService } from "../application/user_service";

describe("User Routes", () => {
	let app: express.Express;
	let mockUserService: jest.Mocked<UserService>;

	beforeEach(() => {
		mockUserService = {
			createUser: jest.fn(),
			getUserById: jest.fn(),
			getAllUsers: jest.fn(),
			updateUser: jest.fn(),
			deleteUser: jest.fn(),
		} as unknown as jest.Mocked<UserService>;

		app = express();
		app.use(express.json());
		app.use("/user", createUserRouter(mockUserService));
	});

	// Все тесты остаются без изменений
	it("should create a user", async () => {
		const user = { id: "1", name: "John Doe", email: "john@example.com" };
		mockUserService.createUser.mockResolvedValue(user);

		const response = await request(app)
			.post("/user/users")
			.send({ name: "John Doe", email: "john@example.com" });

		expect(response.status).toBe(201);
		expect(response.body).toEqual(user);
	});

	// ... остальные тесты
});
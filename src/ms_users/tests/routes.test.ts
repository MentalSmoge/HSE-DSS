import * as request from "supertest";
import * as express from "express";
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

	it("should create a user", async () => {
		const user = { id: "1", name: "John Doe", email: "john@example.com" };
		mockUserService.createUser.mockResolvedValue(user);

		const response = await request(app)
			.post("/user/users")
			.send({ name: "John Doe", email: "john@example.com" });

		expect(response.status).toBe(201);
		expect(response.body).toEqual(user);
	});

	it("should get a user by id", async () => {
		const user = { id: "1", name: "John Doe", email: "john@example.com" };
		mockUserService.getUserById.mockResolvedValue(user);

		const response = await request(app).get("/user/users/1");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(user);
	});

	it("should return 404 if user not found", async () => {
		mockUserService.getUserById.mockResolvedValue(null);

		const response = await request(app).get("/user/users/1");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ error: "User not found" });
	});

	it("should get all users", async () => {
		const users = [{ id: "1", name: "John Doe", email: "john@example.com" }];
		mockUserService.getAllUsers.mockResolvedValue(users);

		const response = await request(app).get("/user/users");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(users);
	});

	it("should update a user", async () => {
		const user = { id: "1", name: "Jane Doe", email: "jane@example.com" };
		mockUserService.updateUser.mockResolvedValue(user);

		const response = await request(app)
			.put("/user/users/1")
			.send({ name: "Jane Doe", email: "jane@example.com" });

		expect(response.status).toBe(200);
		expect(response.body).toEqual(user);
	});

	it("should return 404 if user to update not found", async () => {
		mockUserService.updateUser.mockResolvedValue(null);

		const response = await request(app)
			.put("/user/users/1")
			.send({ name: "Jane Doe", email: "jane@example.com" });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ error: "User not found" });
	});

	it("should delete a user", async () => {
		mockUserService.deleteUser.mockResolvedValue(true);

		const response = await request(app).delete("/user/users/1");

		expect(response.status).toBe(204);
	});

	it("should return 404 if user to delete not found", async () => {
		mockUserService.deleteUser.mockResolvedValue(false);

		const response = await request(app).delete("/user/users/1");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ error: "User not found" });
	});
});
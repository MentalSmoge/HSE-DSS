import { UserService } from "../application/user_service";
import { UserRepository } from "../domain/user";
import { User } from "../domain/user";
import { v4 as uuidv4 } from "uuid";
import { IRedisClient } from "../infrastructure/redis_client_interface";

describe("UserService", () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockRedisClient: jest.Mocked<IRedisClient>;

    beforeEach(() => {
        mockUserRepository = {
            checkConnection: jest.fn(),
            addUser: jest.fn(),
            getUserById: jest.fn(),
            getAllUsers: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
        };
        mockRedisClient = {
            get: jest.fn(),
            setEx: jest.fn(),
            del: jest.fn(),
            on: jest.fn(),
            connect: jest.fn(),
        };
        userService = new UserService(mockUserRepository, mockRedisClient);
    });

    it("should create a user with a generated UUID", async () => {
        const name = "John Doe";
        const email = "john@example.com";

        mockUserRepository.addUser.mockImplementation(async (user) => {
            expect(user.name).toBe(name);
            expect(user.email).toBe(email);
            expect(user.id).toBeDefined();
        });

        const result = await userService.createUser({ name, email });


        expect(result.name).toBe(name);
        expect(result.email).toBe(email);
        expect(result.id).toBeDefined();
    });

    it("should get a user by id", async () => {
        const userId = uuidv4();
        const user = new User(userId, "John Doe", "john@example.com");
        mockUserRepository.getUserById.mockResolvedValue(user);

        const result = await userService.getUserById(userId);

        expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(result).toEqual({ id: userId, name: user.name, email: user.email });
    });

    it("should return null if user not found", async () => {
        const userId = uuidv4();
        mockUserRepository.getUserById.mockResolvedValue(null);

        const result = await userService.getUserById(userId);

        expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(result).toBeNull();
    });

    it("should get all users", async () => {
        const userId = uuidv4();
        const users = [new User(userId, "John Doe", "john@example.com")];
        mockUserRepository.getAllUsers.mockResolvedValue(users);

        const result = await userService.getAllUsers();

        expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
        expect(result).toEqual([{ id: userId, name: "John Doe", email: "john@example.com" }]);
    });

    it("should update a user", async () => {
        const userId = uuidv4();
        const user = new User(userId, "John Doe", "john@example.com");
        mockUserRepository.getUserById.mockResolvedValue(user);
        mockUserRepository.updateUser.mockResolvedValue(undefined);

        const updatedName = "Jane Doe";
        const updatedEmail = "jane@example.com";
        const result = await userService.updateUser(userId, { name: updatedName, email: updatedEmail });

        expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(mockUserRepository.updateUser).toHaveBeenCalledWith(new User(userId, updatedName, updatedEmail));
        expect(result).toEqual({ id: userId, name: updatedName, email: updatedEmail });
    });

    it("should return null if user to update not found", async () => {
        const userId = uuidv4();
        mockUserRepository.getUserById.mockResolvedValue(null);

        const result = await userService.updateUser(userId, { name: "Jane Doe", email: "jane@example.com" });

        expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(result).toBeNull();
    });

    it("should delete a user", async () => {
        const userId = uuidv4();
        mockUserRepository.deleteUser.mockResolvedValue(true);

        const result = await userService.deleteUser(userId);

        expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
});
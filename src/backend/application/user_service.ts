import { UserRepository, CreateUserCommand, User } from '../domain/user';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
    constructor(private userRepository: UserRepository) { }

    async createUser(command: CreateUserCommand): Promise<UserDTO> {
        const user = new User(uuidv4(), command.name, command.email);
        await this.userRepository.addUser(user);
        return { id: user.id, name: user.name, email: user.email };
    }
}

export interface UserDTO {
    id: string;
    name: string;
    email: string;
}
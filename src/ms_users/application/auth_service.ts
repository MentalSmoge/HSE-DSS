import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PostgreSQLUserRepository } from '../infrastructure/userdb_repository';
import { User } from '../domain/user';

export class AuthService {
    constructor(private userRepo: PostgreSQLUserRepository) { }

    async login(username: string, password: string) {
        const user = await this.userRepo.getUserByNameAuth(username);
        if (!user) throw new Error('User not found');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid password');

        return this.generateToken(user);
    }

    private generateToken(user: User) {
        return jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: '1h' }
        );
    }
}
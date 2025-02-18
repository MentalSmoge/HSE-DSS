import { Pool } from 'pg';
import { User, UserRepository } from '../domain/user';

export class PostgreSQLUserRepository implements UserRepository {
    constructor(private pool: InstanceType<typeof Pool>) { }

    async checkConnection(): Promise<void> {
        await this.pool.query("SELECT NOW()", (err, res) => {
            if (err) console.error("Database connection error:", err);
            else console.log("Database connected:", res.rows[0]);
        });
    }
    async addUser(user: User): Promise<void> {
        await this.pool.query(
            'INSERT INTO users(id, name, email) VALUES($1, $2, $3)',
            [user.id, user.name, user.email]
        );
    }
    async getUserById(id: string): Promise<User | null> {
        const result = await this.pool.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const userData = result.rows[0];
        return new User(
            userData.id,
            userData.name,
            userData.email
        );

    }
    async updateUser(user: User): Promise<void> {

    }
    async deleteUser(id: string): Promise<void> {

    }
}
export function createPool(): InstanceType<typeof Pool> {
    return new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST || "user_db",
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT!),
    });
}
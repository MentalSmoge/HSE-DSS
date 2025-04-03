import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());

const SECRET_KEY = 'your-secret-key'; // В реальности храните в .env

// Упрощенная "база данных" пользователей
const users = [
    { id: 1, username: 'user1', password: '$2b$10$...' }
];

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send('Invalid password');

    // Создаем JWT токен
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

app.listen(8080, () => console.log('Auth service running on 8080'));
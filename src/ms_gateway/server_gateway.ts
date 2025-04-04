import express from 'express';
import cors from 'cors';
import { config } from './config';
import router from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/', router);

// Обработка ошибок
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send('Что-то пошло не так!');
});

app.listen(config.PORT, () => {
    console.log(`API Gateway запущен на порту ${config.PORT}`);
});
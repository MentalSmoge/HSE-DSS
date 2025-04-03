import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    // Пропускаем публичные маршруты
    if (config.PUBLIC_ROUTES.some(route => req.path.startsWith(route))) {
        return next();
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).send({ error: 'Требуется аутентификация' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Неверный токен' });
    }
};
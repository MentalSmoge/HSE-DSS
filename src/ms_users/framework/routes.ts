import express from 'express';
import { UserService, UserDTO } from '../application/user_service';

export function createUserRouter(userService: UserService) {
    const router = express.Router();

    router.post('/users', async (req, res) => {
        try {
            const userDTO = await userService.createUser(req.body);
            res.status(201).json(userDTO);
        } catch (error) {
            res.status(500).json({ error: `${error}` });
        }
    });

    return router;
}
import { Router } from 'express';
import {
    editorProxy,
    usersProxy,
} from '../services/http';
import { authenticate } from '../middleware/auth';

const router = Router();

// Публичные маршруты (не требуют аутентификации)
router.use('/user', usersProxy);

// Защищенные маршруты (требуют JWT)
// router.use('/users', authenticate, usersProxy);
router.use('/editor', authenticate, editorProxy);

// Health check
router.get('/healthcheck', (req, res) => { res.status(200).send('OK') });

export default router;
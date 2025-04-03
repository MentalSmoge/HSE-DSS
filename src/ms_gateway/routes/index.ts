import { Router } from 'express';
import {
    authProxy,
    usersProxy,
    editorProxy,
    logsProxy
} from '../services/http';
import { authenticate } from '../middleware/auth';

const router = Router();

// Публичные маршруты (не требуют аутентификации)
router.use('/auth', authProxy);

// Защищенные маршруты (требуют JWT)
router.use('/users', authenticate, usersProxy);
router.use('/editor', authenticate, editorProxy);
router.use('/logs', authenticate, logsProxy);

// Health check
router.get('/healthcheck', (req, res) => { res.status(200).send('OK') });

export default router;
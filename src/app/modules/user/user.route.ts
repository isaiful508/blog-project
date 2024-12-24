import express from 'express';
import { register, login } from './user.controller';

const router = express.Router();

router.post('/auth/register', register); // Register endpoint
router.post('/login', login);       // Login endpoint

export const UserRoutes = router;

import express from 'express';
import { authService } from '../auth.container.js';
import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();

const authController = new AuthController(authService) 

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post(
  "/verify-email",
  authController.verifyEmail
);

export default router;
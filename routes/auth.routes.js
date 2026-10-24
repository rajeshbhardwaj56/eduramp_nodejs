
import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.schema.js';
const authRoutes = express.Router();


authRoutes.post("/register", validate(registerSchema), register)


authRoutes.post("/login", validate(loginSchema), login)


export default authRoutes;

import express from 'express';
import { register } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema } from '../validators/auth.schema.js';
const authRoutes = express.Router();


authRoutes.post("/register", validate(registerSchema), register)


export default authRoutes;
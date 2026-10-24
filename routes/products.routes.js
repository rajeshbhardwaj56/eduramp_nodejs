
import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
const productRoutes = express.Router();


productRoutes.get("/", validate(registerSchema), register)
productRoutes.get("/:id", validate(registerSchema), register)

productRoutes.post("/", validate(registerSchema), register)
productRoutes.patch("/:id", validate(registerSchema), register)
productRoutes.delete("/:id", validate(registerSchema), register)

export default productRoutes;
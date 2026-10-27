import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function accessToken(user) {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: env.JWT_EXPIRES,
  });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_SECRET)
}

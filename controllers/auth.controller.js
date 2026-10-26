import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { accessToken } from "../utils/jwt.js";

const SALT_ROUND = 10;

// Express 5 forwards errors thrown in async handlers to the error handler,
// so ApiErrors keep their own status code (409, 401, ...)
export async function register(req, res) {
  const { name, email, password } = req.validated.body;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw ApiError.conflict("Email Already Exist");
  }

  const hasedPassword = await bcrypt.hash(password, SALT_ROUND);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hasedPassword,
    },
  });

  res.status(201).json({
    success: true,
    message: "Registered Successfully",
    data: { user, accessToken: accessToken(user) },
  });
}


export async function login(req, res) {
  const { email, password } = req.validated.body;

  const user = await prisma.user.findUnique({ where: { email }, omit: { password: false } });

  // same message for both cases so the API doesn't reveal which emails are registered
  if (!user) {
    throw ApiError.unAuthorised("Invalid email or password")
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw ApiError.unAuthorised("Invalid email or password")
  }

  const { password: _hash, ...safeUser } = user;

  res.json({
    success: true,
    message: "Logged in Successfully",
    data: { user: safeUser, accessToken: accessToken(user) },
  });
}

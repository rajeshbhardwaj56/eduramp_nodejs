import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function authenticate(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [schema, token] = header.split(" ");

  if (schema !== "Bearer" || !token) {
    throw ApiError.unAuthorised("Missing or malformed authencation header");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    const message =
      error.message === "TokenExpiredError" ? "Token Expired" : "Invalid Token";
    throw ApiError.unAuthorised(message);
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
  });

  if(!user) {
    throw ApiError.unAuthorised("User no longer exist")
  }

  req.user = user;
  next()
}

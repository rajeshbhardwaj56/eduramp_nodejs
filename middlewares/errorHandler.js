import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
    throw ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`);
}

export function errorHandler(err, req, res, next) {
    // malformed JSON body from express.json()
    if (err.type === "entity.parse.failed") {
        err = ApiError.badRequest("Invalid JSON body");
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.details && { details: err.details }),
        });
    }

    console.error(err);
    res.status(500).json({
        success: false,
        message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
}

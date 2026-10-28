export class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message)
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.details = details;
    }


    static badRequest(message = "Bad Request", details) {
        return new ApiError(400, message, details)
    }

    static conflict(message = "conflict") {
        return new ApiError(409, message)
    }

    static unAuthorised(message = "authentication required") {
        return new ApiError(401, message)
    }

    static forbidden(message = "forbidden") {
        return new ApiError(403, message)
    }

    static notFound(message = "Not found") {
        return new ApiError(404, message)
    }

}
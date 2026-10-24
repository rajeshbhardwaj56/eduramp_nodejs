import { ApiError } from "../utils/ApiError.js";

export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body ?? {},
            params: req.params,
            query: req.query
        });

        if(!result.success) {
            const details = result.error.issues.map(issue => ({
                field: issue.path.slice(1).join('.') || issue.path.join('.'),
                in: issue.path[0],
                message: issue.message
            }))
            throw ApiError.badRequest("Validation Failed", details)
        }

        req.validated = result.data;
        next();
    }
}



class ApiError extends Error {
    constructor(message, statusCode, errors = [], stack = "", details = null) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.success = statusCode<200;
        this.errors = errors;
        this.details = details;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class BadRequestError extends ApiError {
    constructor(message = "Bad Request", details = null) {
        super(message, 400, [], "", details);
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized", details = null) {
        super(message, 401, [], "", details);
    }
}

class ForbiddenError extends ApiError {
    constructor(message = "Forbidden", details = null) {
        super(message, 403, [], "", details);
    }
}

class NotFoundError extends ApiError {
    constructor(message = "Not Found", details = null) {
        super(message, 404, [], "", details);
    }
}

class ConflictError extends ApiError {
    constructor(message = "Conflict", details = null) {
        super(message, 409, [], "", details);
    }
}

class InternalServerError extends ApiError {
    constructor(message = "Internal Server Error", details = null) {
        super(message, 500, [], "", details);
    }
}

export{ApiError,BadRequestError,NotFoundError,ConflictError,UnauthorizedError,ForbiddenError,InternalServerError};
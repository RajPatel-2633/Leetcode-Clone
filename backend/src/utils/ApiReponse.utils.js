class ApiResponse {
  constructor(statusCode, data = null, message = "Success", meta = {}) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success(data = null, message = "Success", statusCode = 200, meta = {}) {
    return new ApiResponse(statusCode, data, message, meta);
  }

  static created(data = null, message = "Resource created") {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = "No Content") {
    return new ApiResponse(204, null, message);
  }

  static error(message = "Something went wrong", statusCode = 500, meta = {}) {
    return new ApiResponse(statusCode, null, message, meta);
  }
}

export { ApiResponse };
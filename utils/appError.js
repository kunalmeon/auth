class appError extends Error {
  constructor(message, statusCode) {
    super(message),
      (this.statusCode = statusCode),
      (this.status = `${statusCode}`.startsWith(4)
        ? "Fail"
        : "internal Server Error"),
      (this.isOperational = true);
  }
}

module.exports = appError;

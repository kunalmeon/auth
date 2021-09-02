const appError = require("../utils/appError");

function handleDevelopementError(err, res) {
 
    res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
}

//casting error
function handleCastError(errorObject) {
  return new appError(
    `invalid value  ${errorObject.value} at palce ${errorObject.path}`,
    400
  );
}

//duplicate keyValue error
function handleDuplicateValueError(errorObject) {
  return new appError(
    `email: ${errorObject.keyValue.email} already exists`,
    400
  );
}

//validator Error
function handlerValidatorError(errorObject) {
  const message = Object.values(errorObject.errors).map((el) => el.message);
  return new appError(message, 400);
}

//Token Error 
function handleJsonWebTokenError(err){
  return new appError("invalid token! Please Login Agian",401)
}

function handleTokenExpiredError(err){
  return new appError("Token Expired! Please Login Again",401)
}

function handleProductionError(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err:err
    });
  } else {
    res.status(500).json({
      status: "ERROR",
      message: "SOMETHING WENT VERY WRONG",
    });
  }
}

module.exports = (err, req, res, next) => {
  err.status = err.status || "Error";
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "developement") {
    handleDevelopementError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let errorObject = { ...err, name: err.name };
    if (errorObject.name === "CastError") {
      errorObject = handleCastError(errorObject);
    }
    if (errorObject.code === 11000) {
      errorObject = handleDuplicateValueError(errorObject);
    }
    if (errorObject.name === "ValidationError") {
      errorObject = handlerValidatorError(errorObject);
    }
    if(errorObject.name==="JsonWebTokenError"){
      errorObject=handleJsonWebTokenError(errorObject)
    }
    if(errorObject.name==="TokenExpiredError"){
      errorObject=handleTokenExpiredError(errorObject)
    }
    handleProductionError(errorObject, res);
  }
};

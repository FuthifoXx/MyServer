const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack
  });
};

const sendErrorProd = (error, res) => {
  //Operational, trusted error: send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
    //Programming or other unknown error: don't leak error details to the client
  } else {
    //1) Log error
    console.error('ERROR 💥', error);
    //Send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (error, req, res, next) => {
  //console.log(error.stack)
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    sendErrorProd(error, res);
  }
};

import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log({err});

  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];

    return res.status(400).json({
      success: false,
      message: "Duplicate Key Error",
      statusCode: 400,
      error: {
        details: [
          {
            path: [key],
            message: `${key} "${value}" already exists.`,
          },
        ],
      },
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }


  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      statusCode: 400,
      error: {
        details: err.errors.map((error: any) => ({
          path: error.path,
          message: error.message,
        })),
      },
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }
  if (err.name === "NOT_FOUND_ERROR") {
    return res.status(404).json({
      success: false,
      message: err.message || "Resource not found",
      statusCode: 404,
      error: {
        details: err.details || "No resource found with the provided identifier",
      },
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      statusCode: 400,
      error: {
        details: Object.values(err.errors).map((e: any) => ({
          path: e.path,
          message: e.message,
        })),
      },
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }


  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      statusCode: 400,
      error: {
        details: `Expected type: ${err.kind}`,
      },
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }


  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      message: "Authentication Error",
      statusCode: 401,
      error: {
        details: "Invalid or expired token.",
      },
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }


  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "JWT Error",
      statusCode: 401,
      error: {
        details: err.message,
      },
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }

  // Generic Error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error: {
      details: err.error.details || "Internal Server Error"
    },
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default globalErrorHandler;

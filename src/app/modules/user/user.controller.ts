import { Request, Response } from 'express';
import { registerUser, loginUser } from './user.service';
import { registerValidationSchema, loginValidationSchema } from './user.validation';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import config from '../../config';

const JWT_SECRET = config.jwt_secret as string;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body with Zod
    const validatedData = registerValidationSchema.parse(req.body);

    const user = await registerUser(validatedData);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      statusCode: 201,
      data: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', statusCode: 400, error: error.errors });
    } else {
      res.status(500).json({ success: false, message: error.message, statusCode: 500 });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body with Zod
    const validatedData = loginValidationSchema.parse(req.body);

    const user = await loginUser(validatedData.email, validatedData.password);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials', statusCode: 401 });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, message: 'Login successful', statusCode: 200, data: { token } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Validation error', statusCode: 400, error: error.errors });
    } else {
      res.status(500).json({ success: false, message: error.message, statusCode: 500 });
    }
  }
};

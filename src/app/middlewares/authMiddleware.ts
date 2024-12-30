import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model'; // Assuming you have a User model
import config from '../config';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = config.jwt_secret as string;

interface AuthRequest extends Request {
  user?: JwtPayload | null;
}

const userAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Token not provided',
        statusCode: 401,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: ' User not found',
        statusCode: 401,
      });
    }

    req.user = { id: user._id, role: user.role };

    next();
  } catch (error : any) {
    return res.status(401).json({
      success: false,
      message: error.message,
      statusCode: StatusCodes.UNAUTHORIZED,
      error: { details: "Jwt token has been expired" },
      stack : error.stack
    });
  }
};

export const adminAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.',
    });
  }
  next();
};


export const  authMiddleware = {
  userAuthMiddleware,
  adminAuthMiddleware,
};

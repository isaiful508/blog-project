import {  UserServices } from './user.service';
import { registerValidationSchema} from './user.validation';
import config from '../../config';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = config.jwt_secret as string;

const registerUser = catchAsync(async (req, res) => {
  const validatedData = registerValidationSchema.parse(req.body);
  console.log({validatedData});
  const result = await UserServices.registerUserIntoDB(validatedData);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Validate the request body with Zod
//     const validatedData = loginValidationSchema.parse(req.body);

//     const user = await loginUser(validatedData.email, validatedData.password);
//     if (!user) {
//       res.status(401).json({ success: false, message: 'Invalid credentials', statusCode: 401 });
//       return;
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ success: true, message: 'Login successful', statusCode: 200, data: { token } });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       res.status(400).json({ success: false, message: 'Validation error', statusCode: 400, error: error.errors });
//     } else {
//       res.status(500).json({ success: false, message: error.message, statusCode: 500 });
//     }
//   }
// };

export const UserControllers = {
  registerUser,
};
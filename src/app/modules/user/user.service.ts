import { User } from './user.model';
import { IUser } from './user.interface';
import { hashPassword, comparePassword } from './user.utils';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

 const registerUserIntoDB = async (data: Partial<IUser>): Promise<IUser> => {
  const { name, email, password } = data;
  const hashedPassword = await hashPassword(password!);

  const user = new User({ name, email, password: hashedPassword });
  return await user.save();
};

export const loginUser = async (email: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    return null;
  }
  return user;
};

export const blockUserInDb = async (userId: string) => {

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(userId);


  if (!user) {
    throw {
          statusCode: StatusCodes.UNAUTHORIZED,
          message: "User not found",
          error: { details: "User did not match" },
        };
  }

  user.isBlocked = true;
  await user.save();
};


export const UserServices = {
  registerUserIntoDB,
  loginUser,
  blockUserInDb,
}
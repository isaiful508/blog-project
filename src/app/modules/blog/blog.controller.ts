import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { BlogServices } from './blog.service';


  export const  createBlog = catchAsync(async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user?.id;

    const blog = await BlogServices.createBlogIntoDb({ title, content, author: userId });

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  });


export const BlogControllers = {
  createBlog
};
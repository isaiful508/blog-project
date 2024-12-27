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



  export const updateBlog = catchAsync(async (req, res) => {
    const blogId = req.params.id;
    const { title, content } = req.body;
    const userId = req.user?.id;
  
    // Update the blog
    const updatedBlog = await BlogServices.updateBlogInDb(blogId, { title, content }, userId);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog,
    });
  });

  export const deleteBlog = catchAsync(async (req, res) => {

    const { id } = req.params;
    const userId = req.user.id;

    await BlogServices.deleteBlogFromDb(id, userId);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Blog Deleted successfully',
    });
  });

export const BlogControllers = {
  createBlog,
  updateBlog,
  deleteBlog
};
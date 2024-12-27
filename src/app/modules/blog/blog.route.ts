import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import authMiddleware from '../../middlewares/authMiddleware';
import { BlogControllers } from './blog.controller';
import { blogValidationSchema, updateBlogValidationSchema } from './block.validation';

const router = express.Router();

router.post('/blogs', authMiddleware, validateRequest(blogValidationSchema), BlogControllers.createBlog);

router.patch('/blogs/:id', authMiddleware,validateRequest(updateBlogValidationSchema), BlogControllers.updateBlog);

router.delete('/blogs/:id', authMiddleware, BlogControllers.deleteBlog);

router.get('/blogs', BlogControllers.getAllBlogs);

export const BlogRoutes = router;

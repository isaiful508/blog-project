import { Blog } from './blog.model';
import { IBlog } from './blog.interface';


  const createBlogIntoDb = async (data: IBlog): Promise<IBlog> => {
    const blog = await Blog.create(data);
    return blog.populate('author');
  }


export const BlogServices = {
  createBlogIntoDb
}

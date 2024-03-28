import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchBlog = async () => {
  try {
    const response = await axios.get(`${API_URL}/blog/all`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
};

export const fetchBlogBySlug = async ({ slug }: any) => {
  try {
    const response = await axios.get(`${API_URL}/blog/${slug}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch blog by id: ${error.message}`);
  }
};

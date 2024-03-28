import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import * as Cookies from 'js-cookie';

export const addBlog = async ({ data }: any) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.post(`${API_URL}/blog/create`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to add blog: ${error.message}`);
  }
};

export const updateBlog = async ({ data }: any) => {
  console.log(data, 'data');
  try {
    const token = await Cookies.get('accessToken');
    const response = await axios.post(`${API_URL}/blog/update`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to update blog: ${error.message}`);
  }
};

export const fetchBlog = async () => {
  try {
    const response = await axios.get(`${API_URL}/blog/all`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
};

export const fetchBlogById = async ({ id }: any) => {
  try {
    const response = await axios.get(`${API_URL}/blog/${id}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch blog by id: ${error.message}`);
  }
};

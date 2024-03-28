import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses/all`);
    return response.data.data;
  } catch (error:any) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

export const fetchSubjectByCourse = async ({ course }: any) => {
  try {
    const response = await axios.get(`${API_URL}/courses/subject/${course}`);
    return response.data.data;
  } catch (error:any) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

export const fetchCoursesById = async ({ id }: any) => {
  try {
    const response = await axios.get(`${API_URL}/courses/${id}`);
    return response.data.data;
  } catch (error:any) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

export const addCourse = async ({ data }: any) => {
  try {
    const token = await Cookies.get('accessToken');
    console.log(data, 'at from from');

    const response = await axios.post(`${API_URL}/courses/create`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error:any) {
    throw new Error(`Failed to add blog: ${error.message}`);
  }
};

export const updateCourse = async ({ data }: any) => {
  try {
    const token = await Cookies.get('accessToken');
    console.log(data, 'at from from');

    const response = await axios.post(`${API_URL}/courses/update`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error:any) {
    throw new Error(`Failed to add blog: ${error.message}`);
  }
};

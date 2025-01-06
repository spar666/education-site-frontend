import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCourses = async (filters: any) => {
  try {
    const params: { [key: string]: string } = {};

    // Only include filters if they exist
    if (filters.level) {
      params.level = filters.level;
    }
    if (filters.category) {
      params.category = filters.category;
    }

    // Send the filters as query parameters in the API request
    const response = await axios.get(`${API_URL}/courses/all`, { params });

    return response.data.data;
  } catch (error: any) {
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

export const updateCourse = async ( data : any) => {
  try {
    const token = await Cookies.get('accessToken');
    console.log(data, 'at from from');

    const response = await axios.put(`${API_URL}/courses/update`, data, 
    );

    return response;
  } catch (error:any) {
    throw new Error(`Failed to add blog: ${error.message}`);
  }
};

export const deleteCourse = async (id:string) => {
  try {
    const token = Cookies.get('accessToken');

    const response = await axios.delete(`${API_URL}/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error:any) {
    throw new Error(`Failed to delete course: ${error.message}`);
  }
};

export const updateCourseStatus = async (id:string) => {
  try {
    const token = Cookies.get('accessToken');

    const response = await axios.put(`${API_URL}/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error:any) {
    throw new Error(`Failed to update course: ${error.message}`);
  }
};

export const fetchCourseCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses/categories/all`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch course categories:', error);
    throw new Error('Failed to fetch course categories');
  }
};

export const fetchCourseCategoriesById = async (id:string) => {
  try {
    const response = await axios.get(`${API_URL}/courses/categories/${id}`);
    return response;
  } catch (error: any) {
    console.error('Failed to fetch course categories:', error);
    throw new Error('Failed to fetch course categories');
  }
};

export const updateCourseCategoriesById = async (data:any) => {
  try {
    const response = await axios.put(`${API_URL}/courses/categories/update`, data);
    return response;
  } catch (error: any) {
    console.error('Failed to fetch course categories:', error);
    throw new Error('Failed to fetch course categories');
  }

  
};

export const fetchStudyLevelsById = async (id:string) => {
  try {
    const response = await axios.get(`${API_URL}/courses/levels/${id}`);
    return response;
  } catch (error: any) {
    console.error('Failed to fetch level:', error);
    throw new Error('Failed to fetch level');
  }
};

export const updateStudyLevelsById = async (data:any) => {
  try {
    const response = await axios.put(`${API_URL}/courses/levels/update`, data);
    return response;
  } catch (error: any) {
    console.error('Failed to fetch level:', error);
    throw new Error('Failed to fetch level');
  }

  
};


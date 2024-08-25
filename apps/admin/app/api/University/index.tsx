import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addUniversity = async (uni: any) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.post(
      `${API_URL}/university/create`,
      uni.universityData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response;
  } catch (error: any) {
    throw new Error(`Failed to add University: ${error.message}`);
  }
};

export const updateUniversity = async (data: any) => {
  console.log(data, 'data');
  try {
    const token = await Cookies.get('accessToken');
    const response = await axios.put(`${API_URL}/university/update`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to update blog: ${error.message}`);
  }
};

export const fetchUniversity = async () => {
  try {
    const response = await axios.get(`${API_URL}/university/all`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

export const fetchUniversityById = async ({ id }: any) => {
  try {
    const response = await axios.get(`${API_URL}/university/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

export const updateUniversityStatus = async (id: string) => {
  try {
    const token = Cookies.get('accessToken');

    const response = await axios.put(`${API_URL}/university/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to update university: ${error.message}`);
  }
};

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addUser = async (data: any) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.post(`${API_URL}/user/addNewUser`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to add University: ${error.message}`);
  }
};

export const fetchAllStudent = async () => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.post(`${API_URL}/user/getStudents`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to add University: ${error.message}`);
  }
};

export const fetchAllUser = async () => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.get(`${API_URL}/user/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to add University: ${error.message}`);
  }
};

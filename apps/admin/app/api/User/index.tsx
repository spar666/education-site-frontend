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
    throw new Error(`Failed to fetch students: ${error.message}`);
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
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

// Fetch user by ID
export const fetchUserById = async (id: string) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.get(`${API_URL}/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

// Update user role
export const updateUserRole = async (id: string, role: string) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.patch(
      `${API_URL}/user/updateRole/${id}`,
      { role },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response;
  } catch (error: any) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }
};

// Update user data
export const updateUser = async (id: string, data: any) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.patch(`${API_URL}/user/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

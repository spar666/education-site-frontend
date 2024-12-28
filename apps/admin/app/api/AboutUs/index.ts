import axios from 'axios';

import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addAboutUs = async ({ data }: any) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.post(`${API_URL}/about/create`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to add about us: ${error.message}`);
  }
};

export const updateAboutUs = async (data: any) => {
  console.log(data, 'data');
  try {
    const token = await Cookies.get('accessToken');
    console.log(token);
    const response = await axios.put(`${API_URL}/about/update`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to update about us: ${error.message}`);
  }
};

export const fetchAboutUs = async () => {
  try {
    const response = await axios.get(`${API_URL}/about/all`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch about us: ${error.message}`);
  }
};

export const fetchAboutUsById = async ({ id }: any) => {
  try {
    const response = await axios.get(`${API_URL}/about/id/${id}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch about by id: ${error.message}`);
  }
};

export const deleteAboutUsById = async ({ id }: any) => {
  try {
    const response = await axios.delete(`${API_URL}/about/id/${id}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch about by id: ${error.message}`);
  }
};

export const updateAboutStatus = async ({ id }: any) => {
  try {
    const response = await axios.put(`${API_URL}/about/status/id/${id}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch about by id: ${error.message}`);
  }
};

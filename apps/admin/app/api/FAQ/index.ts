import axios from 'axios';

import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;



export const addFaq = async ({ data }: any) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.post(`${API_URL}/faq/create`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to add faq: ${error.message}`);
  }
};

export const updateFaq = async ( data : any) => {

  try {
    const token = await Cookies.get('accessToken');
    const response = await axios.put(`${API_URL}/faq/update`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to update faq: ${error.message}`);
  }
};

export const fetchFaq = async () => {
  try {
    const response = await axios.get(`${API_URL}/faq/all`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch faq: ${error.message}`);
  }
};

export const fetchFaqById = async ({ id }: any) => {
  try {
    const response = await axios.get(`${API_URL}/faq/id/${id}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch blog by id: ${error.message}`);
  }
};

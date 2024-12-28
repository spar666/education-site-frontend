import axios from 'axios';

import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addBanner= async ({ data }: any) => {
  try {
    const token = await Cookies.get('accessToken');

    const response = await axios.post(`${API_URL}/banner/create`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to add banner: ${error.message}`);
  }
};

export const updateBanner= async (data: any) => {
  try {
    const token = await Cookies.get('accessToken');
    console.log(token);
    const response = await axios.put(`${API_URL}/banner/update`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to update banner: ${error.message}`);
  }
};

export const fetchBanner= async () => {
  try {
    const response = await axios.get(`${API_URL}/banner/all`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch banner: ${error.message}`);
  }
};

export const fetchBannerById = async ({ id }: any) => {
  try {
    const response = await axios.get(`${API_URL}/banner/id/${id}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch banner by id: ${error.message}`);
  }
};

export const deleteBannerById = async ({ id }: any) => {
  try {
    const response = await axios.delete(`${API_URL}/banner/id/${id}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch banner by id: ${error.message}`);
  }
};

export const updateBannerStatus = async (id : any) => {
  console.log(id, "idss")
  try {
    const response = await axios.put(`${API_URL}/banner/status/id/${id}`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to banner about by id: ${error.message}`);
  }
};

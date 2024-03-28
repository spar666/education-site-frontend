import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addUserForAppointment = async ({ data }: any) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, data);

    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to add blog: ${error.message}`);
  }
};

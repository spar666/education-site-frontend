import axios from 'axios';
let API_URL = 'localhost:3001/api/uploads/';

export const addFile = async ({ fileName }: any) => {
  try {
    const response = await axios.post(API_URL, {
      fileName,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error adding file:', error);
    throw error;
  }
};

export const getFile = ({ fileName }: any) => {
  const response = axios.post(`${API_URL}/${fileName}`);
  return response;
};

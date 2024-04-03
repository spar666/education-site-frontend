import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}user/getStudents`);
    return response.data.data;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
};

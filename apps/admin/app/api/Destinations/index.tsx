import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllUniversityByDestination = async () => {
  try {
    const response = await axios.get(`${API_URL}/destination/all`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch university:', error);
    throw new Error('Failed to fetch university');
  }
};

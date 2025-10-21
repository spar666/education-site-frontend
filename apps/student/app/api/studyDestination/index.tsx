import axios from 'axios';

const API_URL: any = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllUniversityByDestination = async () => {
  try {
    console.log('API URL for all destinations:', `${API_URL}/destination/all`);
    const response = await axios.get(`${API_URL}/destination/all`);
    console.log('All destinations API response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch all destinations:', error?.response?.data || error.message);
    throw new Error('Failed to fetch university');
  }
};

export const fetchAllPopularDestination = async () => {
  try {
    console.log('API URL for popular destinations:', `${API_URL}/destination/popular`);
    const response = await axios.get(`${API_URL}/destination/popular`);
    console.log('Popular destinations API response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch popular destinations:', error?.response?.data || error.message);
    throw new Error('Failed to fetch university');
  }
};

export const fetchAllUniversitiesByPopularDestination = async ({
  slug,
}: any) => {
  try {
    console.log('API URL for universities by destination:', `${API_URL}/destination/popularDestination/${slug}`);
    const response = await axios.get(
      `${API_URL}/destination/popularDestination/${slug}`
    );
    console.log('Universities by destination API response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch universities by destination:', error?.response?.data || error.message);
    throw new Error('Failed to fetch university');
  }
};

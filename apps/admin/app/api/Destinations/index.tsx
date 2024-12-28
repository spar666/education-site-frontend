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

export const fetchDestinationById = async (id: any) => {
  try {
    const response = await axios.get(`${API_URL}/destination/id/${id}`);
    return response;
  } catch (error: any) {
    console.error('Failed to fetch destination:', error);
    throw new Error('Failed to fetch destination');
  }
};

export const updateDestinationById = async (data: any) => {
  try {
    const response = await axios.put(`${API_URL}/destination/update`, data);
    return response;
  } catch (error: any) {
    console.error('Failed to destination:', error);
    throw new Error('Failed to destination');
  }
};

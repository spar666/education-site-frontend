import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get auth token
const getAuthToken = (): string | undefined => {
  return Cookies.get('accessToken');
};

// Helper function to create auth headers
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const addUniversity = async (uni: any) => {
  try {
    const response = await axios.post(`${API_URL}/university/create`, uni, {
      headers: createAuthHeaders(),
    });

    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to add University: ${errorMessage}`);
  }
};

export const updateUniversity = async (data: any) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(`${API_URL}/university/update`, data, {
      headers: createAuthHeaders(),
    });

    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to update university: ${errorMessage}`);
  }
};

export const fetchUniversity = async () => {
  try {
    const response = await axios.get(`${API_URL}/university/all`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to fetch universities: ${errorMessage}`);
  }
};

export const fetchUniversityById = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get(`${API_URL}/university/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to fetch university: ${errorMessage}`);
  }
};

export const updateUniversityStatus = async (id: string) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(
      `${API_URL}/university/${id}`,
      {}, // Empty body for status update
      {
        headers: createAuthHeaders(),
      }
    );

    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to update university status: ${errorMessage}`);
  }
};

export const deleteUniversity = async (id: string) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.delete(`${API_URL}/university/${id}`, {
      headers: createAuthHeaders(),
    });

    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to delete university: ${errorMessage}`);
  }
};

export const generateUniversityWithAI = async (prompt: string) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(
      `${API_URL}/ai-enrichment/search-university`,
      {
        universityName: prompt,
        destination: 'Australia', // Default destination, can be made configurable
      },
      {
        headers: createAuthHeaders(),
      }
    );

    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to generate university with AI: ${errorMessage}`);
  }
};

export const enrichDataWithAI = async (params: {
  destination?: string;
  courseCategory?: string;
  studyLevel?: string;
  limit?: number;
  includeCourses?: boolean;
  includeCategories?: boolean;
}) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(
      `${API_URL}/ai-enrichment/enrich`,
      {
        destination: params.destination || 'Australia',
        courseCategory: params.courseCategory,
        studyLevel: params.studyLevel,
        limit: params.limit || 50,
        includeCourses: params.includeCourses ?? true,
        includeCategories: params.includeCategories ?? true,
      },
      {
        headers: createAuthHeaders(),
      }
    );

    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to enrich data with AI: ${errorMessage}`);
  }
};

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SearchParams {
  courseCategory?: string;
  level?: string;
  location?: string;
  university?: string;
  rankingOrder?: string;
  feesOrder?: string;
  scholarshipOrder?: string;
  destination?: string;
  qualification?: string;
  page?: number;
  limit?: number;
}

export const search = async (params: SearchParams) => {
  const {
    courseCategory,
    level,
    location,
    university,
    rankingOrder,
    feesOrder,
    scholarshipOrder,
    destination,
    qualification,
    page = 1,
    limit = 10,
  } = params;

  console.log('=== Search API Function Called ===');
  console.log('API URL:', API_URL);
  console.log('Full endpoint:', `${API_URL}/university/search`);
  console.log('Search parameters:', {
    qualification,
    level,
    location,
    university,
    rankingOrder,
    feesOrder,
    scholarshipOrder,
    courseCategory,
    destination,
    page,
    limit,
  });
  
  try {
    // Build the request payload, only including non-empty values
    const payload: any = {};
    
    if (qualification) payload.qualification = qualification;
    if (level) payload.level = level;
    if (location) payload.location = location;
    if (university) payload.university = university;
    if (rankingOrder) payload.rankingOrder = rankingOrder;
    if (feesOrder) payload.feesOrder = feesOrder;
    if (scholarshipOrder) payload.scholarshipOrder = scholarshipOrder;
    if (courseCategory) payload.courseCategory = courseCategory;
    if (destination) payload.destination = destination;
    if (page) payload.page = page;
    if (limit) payload.limit = limit;

    console.log('Cleaned payload (non-empty values only):', payload);

    const response = await axios.post(`${API_URL}/university/search`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Search API response status:', response.status);
    console.log('Search API response data:', response.data);
    
    // Return the data array directly if it exists, otherwise return the whole response
    if (response.data?.data) {
      console.log('Returning data array with', response.data.data.length, 'universities');
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      console.log('Returning response array with', response.data.length, 'universities');
      return response.data;
    } else {
      console.log('Returning full response object');
      return response.data;
    }
  } catch (error: any) {
    console.error('=== Search API Error ===');
    console.error('Error message:', error.message);
    console.error('Error response:', error?.response?.data);
    console.error('Error status:', error?.response?.status);
    console.error('Error config:', error?.config);
    
    // Return empty array on error instead of throwing
    if (error?.response?.status === 404) {
      console.log('No universities found (404), returning empty array');
      return [];
    }
    
    throw error;
  }
};

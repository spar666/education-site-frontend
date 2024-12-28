import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const search = async ({
  courseCategory,
  level,
  location,
  university,
  rankingOrder,
  feesOrder,
  scholarshipOrder,
  destination,
  qualification,
}: any) => {
  console.log(level, 'levelsss');
  try {
    const response = await axios.post(`${API_URL}/university/search`, {
      courseCategory,
      level,
      location,
      university,
      rankingOrder,
      feesOrder,
      scholarshipOrder,
      destination,
      qualification,
    });

    console.log(response, 'response');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchStudyLevels = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/studyLevel/all`
    );
    return response.data.data;
  } catch (error:any) {
    console.error('Failed to fetch study levels:', error);
    throw new Error('Failed to fetch study levels');
  }
};
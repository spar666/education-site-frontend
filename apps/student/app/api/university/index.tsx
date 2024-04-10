import axios from 'axios';

const API_URL: any = process.env.NEXT_PUBLIC_API_URL;

export const fetchUniversityByDestination = async (country: any) => {
  try {
    const response = await axios.get(
      `${API_URL}/destination/fetchUniversity/${country}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch university:', error);
    throw new Error('Failed to fetch university');
  }
};

export const fetchUniversityBySlug = async ({ uni }: any) => {
  try {
    const response = await axios.get(`${API_URL}/university/slug/${uni}`);
    console.log(response.data, 'response');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch university:', error);
    throw new Error('Failed to fetch university');
  }
};

export const fetchAllUniversity = async () => {
  try {
    const response = await axios.get(`${API_URL}university/all`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

export const fetchUniversityByCourse = async ({
  subjectName,
  destination,
}: any) => {
  try {
    let url = `${API_URL}/university/course/${subjectName}`;

    if (destination) {
      url += `?destination=${destination}`;
    }

    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    throw new Error('Failed to fetch universities');
  }
};

export const fetchUniversitiesByIds = async (ids: any) => {
  try {
    const parsedArray = JSON.parse(ids);
    const joinedIds = parsedArray.join(',').toString();
    console.log(joinedIds, 'joinedIds');

    const response = await axios.get(
      `${API_URL}/university/multiple/${joinedIds}`
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    throw new Error('Failed to fetch universities');
  }
};

export const fetchUniversitiesByIdsForCompare = async (ids: string[]) => {
  try {
    // Flatten the array of IDs
    const concatenatedIds = ids.join(',');

    const response = await axios.get(
      `${API_URL}/university/multiple/${concatenatedIds}`
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    throw new Error('Failed to fetch universities');
  }
};

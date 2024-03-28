import axios from 'axios';

const API_URL: any = process.env.NEXT_PUBLIC_API_URL;

export const fetchUniversityByDestination = async ({ country }: any) => {
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
    const response = await axios.get(`${API_URL}/university/${uni}`);
    console.log(response, 'response');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch university:', error);
    throw new Error('Failed to fetch university');
  }
};

export const fetchAllUniversity = async () => {
  try {
    const response = await axios.get(`${API_URL}/university/all`);
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

export const fetchUniversitiesByIds = async ({ ids }: any) => {
  try {
    console.log(ids, 'ids');
    // Concatenate all arrays into a single array
    const concatenatedArray = [].concat(...ids);

    console.log(concatenatedArray, 'concatenatedArray');

    // Convert the concatenated array into a string
    const joinedString = concatenatedArray.join(',');
    console.log(joinedString, 'joinedString');

    const parsedIds = JSON.parse(joinedString);
    console.log(parsedIds, 'parsedIds');

    const response = await axios.get(
      `${API_URL}/university/multiple/${parsedIds}`
    );

    return response.data; // Return response data directly
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    throw new Error('Failed to fetch universities');
  }
};

export const fetchUniversitiesByIdsForComapre = async ({ ids }: any) => {
  try {
    console.log(ids, 'ids');
    // Concatenate all arrays into a single array
    const concatenatedArray = [].concat(...ids);

    console.log(concatenatedArray, 'concatenatedArray');

    // Convert the concatenated array into a string
    const joinedString = concatenatedArray.join(',');
    console.log(joinedString, 'joinedString');

    const response = await axios.get(
      `${API_URL}/university/multiple/${joinedString}`
    );

    return response.data; // Return response data directly
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    throw new Error('Failed to fetch universities');
  }
};

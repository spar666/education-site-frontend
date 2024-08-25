import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses/all`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch courses');
  }
};

const fetchPublicCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses/public/all`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch courses');
  }
};

const fetchSubjectByCourse = async ({ course }: any) => {
  try {
    const response = await axios.get(`${API_URL}/courses/subject/${course}`);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch subjects by course');
  }
};

const fetchCourseByLevel = async ({
  degree,
  universityId,
  destination,
}: {
  degree: string;
  universityId?: string;
  destination?: string;
}): Promise<any> => {
  console.log(degree, 'degree');
  try {
    let url = `${API_URL}/courses/level/${degree}`;
    const queryParams: string[] = [];

    if (universityId) {
      queryParams.push(`universityId=${universityId}`);
    }
    if (destination) {
      queryParams.push(`destination=${destination}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch courses by level');
  }
};

const fetchCourseCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses/categories/all`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch course categories:', error);
    throw new Error('Failed to fetch course categories');
  }
};

const fetchCategoriesWithCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses/categories/courses`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch course categories:', error);
    throw new Error('Failed to fetch course categories');
  }
};

export {
  fetchCourses,
  fetchSubjectByCourse,
  fetchCourseByLevel,
  fetchPublicCourses,
  fetchCourseCategories,
  fetchCategoriesWithCourses,
};

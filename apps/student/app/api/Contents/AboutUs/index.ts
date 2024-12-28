import axios from 'axios';

import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllAboutUs = async () => {
  try {
    const response = await axios.get(`${API_URL}/about/all/published`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch about us: ${error.message}`);
  }
};

import axios from 'axios';

import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllFaq = async () => {
  try {
    const response = await axios.get(`${API_URL}/faq/all`);
    return response;
  } catch ({ error }: any) {
    throw new Error(`Failed to fetch faq: ${error.message}`);
  }
};

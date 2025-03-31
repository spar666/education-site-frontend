import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ILogin {
  email: string;
  password: string;
}

interface IRegister {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  gender?: string;
  password: string;
}

const login = ({ email, password }: ILogin) => {
  return axios.post(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
    email,
    password,
  });
};

const register = ({
  firstName,
  middleName,
  lastName,
  email,
  gender,
  password,
}: any) => {
  return axios.post(`${API_URL}/auth/signup`, {
    firstName,
    middleName,
    lastName,
    email,
    gender,
    password,
  });
};

const profile = ({ token }: any) => {
  console.log(token, 'toekn');
  return axios.get(process.env.NEXT_PUBLIC_API_URL + '/user/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getPreferences = (token: any) => {
  return axios.get(process.env.NEXT_PUBLIC_API_URL + '/user/prefernces', {
    headers: { Authorization: `Bearer ${token}` },
  });
};
const AuthService = {
  login,
  register,
  profile,
  getPreferences,
};

export default AuthService;

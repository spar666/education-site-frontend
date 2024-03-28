import axios from "axios";

interface ILogin {
  email: string;
  password: string;
}

interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  photoPath?: string;
  gender: string;
  phoneNumber: string;
  password: string;
}

const login = ({ email, password }: ILogin) => {
  return axios.post(process.env.NEXT_PUBLIC_API_URL + "auth/login", {
    email,
    password,
  });
};

const register = ({
  firstName,
  lastName,
  email,
  photoPath,
  gender,
  phoneNumber,
  password,
}: IRegister) => {
  return axios.post(process.env.NEXT_PUBLIC_API_URL + "auth/signup", {
    firstName,
    lastName,
    email,
    photoPath,
    gender,
    phoneNumber,
    password,
  });
};

const profile = ({ token }: any) => {
  console.log(token, "toekn")
  return axios.get(process.env.NEXT_PUBLIC_API_URL + "user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
const AuthService = {
  login,
  register,
  profile,
};

export default AuthService;

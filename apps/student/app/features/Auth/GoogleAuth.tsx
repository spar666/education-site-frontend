'use client';

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { notification } from 'antd';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useDispatch } from 'react-redux';
import GoogleLogo from '../../../assets/Logo/google.png';
import Image from 'next/image';

interface IProps {
  successCB?: () => void;
  type?: 'Login' | 'Signup';
}

function GoogleWrapper({ successCB, type = 'Login' }: IProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  //   if (!clientId) {
  //     console.error(
  //       'Missing Google Client ID! Ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is set.'
  //     );
  //     return null;
  //   }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleButtonChild successCB={successCB} type={type} />
    </GoogleOAuthProvider>
  );
}

function GoogleButtonChild({ successCB, type }: IProps) {
  //   const dispatch = useDispatch();

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (codeResponse) => {
      try {
        const endpoint =
          type === 'Login'
            ? `${process.env.NEXT_PUBLIC_BASE_API}/api/auth/google/login`
            : `${process.env.NEXT_PUBLIC_BASE_API}/api/auth/google/signup`;

        const { data } = await axios.post(endpoint, {
          access_token: `${codeResponse.access_token}`,
        });

        // Set cookies and dispatch token to Redux
        setCookie('accessToken', data.access_token);
        // dispatch(updateAccessToken(data.access_token));

        // Notify user and trigger callback
        notification.success({ message: data.message });
        successCB && successCB();
      } catch (error: any) {
        notification.error({
          message:
            error.response?.data?.message ||
            'Something went wrong. Please try again.',
        });
      }
    },
    onError: () => {
      notification.error({ message: 'Google Authentication Failed' });
    },
  });

  return (
    <button
      className="border-2 w-full py-3 text-dark-blue font-semibold flex justify-center items-center hover:bg-gray-100 rounded-md"
      onClick={() => login()}
    >
      <Image
        src={GoogleLogo}
        height={20}
        width={20}
        className="mr-2"
        alt="Google Icon"
      />
      {type} with Google
    </button>
  );
}

export default GoogleWrapper;

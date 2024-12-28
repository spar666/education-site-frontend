'use client';
import React, { useEffect } from 'react';
import { Alert, Button, Input, Space, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import AuthService from '../../api/Auth';
import Cookies from 'js-cookie';
import { updateUserDetails } from 'apps/admin/store/userSlice';
import { isValidEmail } from 'apps/admin/utils/helper/helper';
import { cookies } from 'next/headers';


interface ILogin {
  email: string;
  password: string;
}

export function LoginAdmin() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const { handleSubmit, control } = useForm<ILogin>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Async function to create a 'name' cookie
 

  const getMyDetails = async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      // Handle missing token case
      return;
    }
    console.log(token, 'tokenennenen');
    try {
      const response = await AuthService.profile({ token });
      console.log(response.data.data, 'from profile');
      dispatch(updateUserDetails(response.data.data));
      // window.location.reload();
    } catch (error) {
      console.error('Error fetching user details:', error);
      notification.error({ message: 'Failed to fetch user details' });
    }
  };

  const loginHandler = async (data: ILogin) => {
    try {
      setLoading(true);
      const response = await AuthService.login(data);
      if (response.data.access_token) {
        Cookies.set('accessToken', response.data.access_token, { expires: 1 }); // Cookie expires in 1 day
        localStorage.setItem('token', 'accessToken');
        await getMyDetails();
        notification.success({ message: response.data.message });
      } else {
        notification.error({ message: 'Unexpected response from server' });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Invalid email or password';
      notification.error({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-xl mb-5">Admin Login</h4>
      <form onSubmit={handleSubmit(loginHandler)}>
        <Space size="large" direction="vertical" className="w-full">
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required!',
              validate: (email) =>
                isValidEmail(email) ||
                'The email you’ve entered is incorrect. Please, try again.',
            }}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <>
                <Input
                  autoComplete="new-password"
                  placeholder="Email*"
                  type="text"
                  onChange={onChange}
                  value={value}
                />
                {errors?.email && (
                  <div className="mt-1 mb-4">
                    <Alert
                      message={
                        <span className="text-red-400">
                          {errors.email?.message}
                        </span>
                      }
                      type="error"
                    />
                  </div>
                )}
              </>
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required!' }}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <>
                <Input.Password
                  autoComplete="new-password"
                  placeholder="Password*"
                  onChange={onChange}
                  value={value}
                />
                {errors?.password && (
                  <div className="mt-1 mb-4">
                    <Alert
                      message={
                        <span className="text-red-400">
                          {errors.password?.message}
                        </span>
                      }
                      type="error"
                    />
                  </div>
                )}
              </>
            )}
          />
          <Button
            size="large"
            className="w-full bg-blue-500 text-white"
            htmlType="submit"
            loading={loading}
          >
            Login
          </Button>
          <div className="block lg:flex md:justify-between">
            <div className="flex justify-center my-1">
              <Link href="/auth/forgot-password">Forgot Password?</Link>
            </div>
            <div className="flex justify-center my-1">
              <Link href="/auth/resend-email">Resend Verification Email</Link>
            </div>
          </div>
        </Space>
      </form>
    </>
  );
}

export default LoginAdmin;

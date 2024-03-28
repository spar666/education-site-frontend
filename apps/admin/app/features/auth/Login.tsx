'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Alert, Button, Input, Space, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import AuthService from '../../api/Auth';

import Cookies from 'js-cookie';
import { setCookie } from 'cookies-next';
import { updateUserDetails } from 'apps/admin/store/userSlice';
import { isValidEmail } from 'apps/admin/utils/helper/helper';

interface ILogin {
  email: string;
  password: string;
}

export function LoginAdmin() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const ref = useRef<any>();

  const { handleSubmit, control } = useForm<ILogin>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getMyDetails = async () => {
    const token = await Cookies.get('accessToken');

    try {
      const response = await AuthService.profile({ token });
      console.log(response.data.data, 'from profile');
      dispatch(updateUserDetails(response.data.data));
    } catch (error) {
      // Handle error
    }
  };

  const loginHandler = async (data: ILogin) => {
    try {
      setLoading(true);
      const response = await AuthService.login(data);
      setCookie('accessToken', response.data.access_token);
      await getMyDetails();
      notification.success({ message: response.data.message });
    } catch (error) {
      notification.error({ message: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ref?.current?.focus();
  }, []);

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
                  ref={ref}
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
            rules={{
              required: 'Password is required!',
            }}
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
          <div className="block lg:flex md:justify-between ">
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

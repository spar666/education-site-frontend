'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ Import useRouter
import { notification } from 'antd';
import GoogleAuth from '../GoogleAuth';
import Logo from '../../../../assets/Logo/Logo.png';
import Image from 'next/image';
import AuthService from 'apps/student/app/api/auth';
import { useDispatch } from 'react-redux';
import useUser from 'apps/student/hook/useUser';
import { setCookie, getCookie } from 'cookies-next';
import { updateUserDetails } from 'apps/student/store/userSlice';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getMyDetails = async () => {
    const token = getCookie('accessToken');
    if (!token) {
      // Handle missing token case
      return;
    }
    console.log(token, 'tokenennenen');
    try {
      const response = await AuthService.profile({ token });
      console.log(response.data.data, 'from profile');
      dispatch(updateUserDetails(response.data.data));
    } catch (error) {
      console.error('Error fetching user details:', error);
      notification.error({ message: 'Failed to fetch user details' });
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await AuthService.login(data);
      if (response.data.access_token) {
        setCookie('accessToken', response.data.access_token);
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
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center gap-2">
          <Link href="/">
            <Image src={Logo} width={70} height={70} alt="logo" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    type="email"
                    placeholder="Email*"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Password Field */}
          <div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    type="password"
                    placeholder="Password*"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <span
              className="text-sm text-dark-blue cursor-pointer hover:underline"
              onClick={() => notification.info({ message: 'Forgot Password?' })}
            >
              Forgot Password?
            </span>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-dark-blue text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        {/* Google Auth */}
        {/* <div className="flex justify-center mb-4">
          <GoogleAuth
            successCB={() => router.push('/dashboard')}
            type="Login"
          />
        </div> */}

        {/* Signup Link */}
        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-dark-blue hover:underline"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';
import { Form, Input, Button, notification } from 'antd';
import GoogleAuth from '../GoogleAuth';
import Image from 'next/image';
import Logo from '../../../../assets/Logo/Logo.png';
import AuthService from 'apps/student/app/api/auth';
import Link from 'next/link';
import { useState } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

// Define the form data interface based on the schema
interface FormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender?: string;
}

// Define the expected response from the AuthService
interface AuthResponse {
  data: {
    status: number;
    message: string;
    error?: string;
  };
}

// Form Validation Schema using zod
const formSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().nonempty('Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().nonempty('Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  gender: z.string().optional(),
});

// Type for the Form component
type FormItemProps = {
  name: keyof FormData;
  label: string;
  rules?: Array<{
    required?: boolean;
    message: string;
    min?: number;
    type?: string;
  }>;
};

export default function RegisterPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<FormData>();
  const router = useRouter();

  const onFinish = async (data: FormData) => {
    setLoading(true);
    try {
      // Validate with zod schema
      formSchema.parse(data);

      const response: AuthResponse = await AuthService.register(data);

      if (response.data.status === 201) {
        notification.success({
          message: response.data.message,
        });
        form.resetFields();
        router.push('/auth/sign-in');
      } else {
        notification.error({
          message: response.data.error || 'Registration failed',
        });
      }
    } catch (error) {
      // Handle zod validation errors or API errors
      if (error instanceof z.ZodError) {
        notification.error({
          message: error.errors[0].message,
        });
      } else {
        notification.error({
          message: (error as Error).message || 'An error occurred',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen mt-10 items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image src={Logo} width={70} height={70} alt="logo" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mt-4">Register</h2>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4 mt-6"
          autoComplete="off"
        >
          {/* First Name */}
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          {/* Middle Name */}
          <Form.Item name="middleName" label="Middle Name (optional)">
            <Input placeholder="Middle Name" />
          </Form.Item>

          {/* Last Name */}
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Last name is required' }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Phone Number is required' }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {loading ? 'Loading...' : 'Register'}
            </Button>
          </Form.Item>
        </Form>

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
            successCB={() => console.log('Success!')}
            type="Register"
          />
        </div> */}

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-blue-500 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

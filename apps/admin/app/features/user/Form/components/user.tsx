import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Button, Col, Row, notification, Select } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UserSchema from '../validation'; // Assuming there's a validation schema for User
import SCSelect from 'apps/admin/components/SCForm/SCSelect';
import { addUser, fetchUserById, updateUser } from 'apps/admin/app/api/User'; // Import necessary functions

// Lazy-loaded component imports
const JTLoader = lazy(() => import('../../../../../components/SCLoader'));
const SCTextArea = lazy(
  () => import('../../../../../components/SCForm/SCTextArea')
);
const SCInput = lazy(() => import('../../../../../components/SCForm/SCInput'));

const { Option } = Select;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  role: string;
}

const initialUserState: User = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  role: 'admin',
};

const AddUserForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get user ID from URL params

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    setValue, // Import setValue from react-hook-form
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
    defaultValues: initialUserState,
  });

  // Fetch user data if ID is present
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchUserById(id)
        .then((response) => {
          const userData = response.data;
          // Set the form fields with the fetched data
          Object.keys(userData).forEach((key) => {
            setValue(key as keyof User, userData[key]);
          });
          // No need to set 'gender' separately since Controller handles it
        })
        .catch((error) => {
          notification.error({ message: error.message });
        })
        .finally(() => setLoading(false));
    }
  }, [id, setValue]);

  const onSubmit: SubmitHandler<User> = async (data) => {
    setLoading(true);
    try {
      let response;
      if (id) {
        // Update existing user
        response = await updateUser(id, data);
      } else {
        // Add new user
        response = await addUser(data);
      }

      if (response.status === 201 || response.status === 200) {
        notification.success({
          message: response.data.message || 'User successfully saved!',
        });
        router.push('/user');
      } else if (response.status === 409) {
        notification.error({
          message: 'This email is already registered.',
        });
      } else {
        // Handle different error statuses

        if (response.status === 400) {
          notification.error(response.data.error.message);
        } else if (response.status === 404) {
          notification.error(response.data.error.message);
        } else if (response.status === 500) {
          notification.error(response.data.error.message);
        }

        notification.error(response.data.error.message);
      }
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <JTLoader visible={loading} />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 pb-8">
          <h3 className="text-xl font-bold mt-7 py-8 m-0">
            {id ? 'Edit' : 'Create'} User
          </h3>
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={12}>
              <SCInput
                register={register}
                name="firstName"
                control={control}
                label="First Name"
                parentClass="flex-grow mb-4"
                error={errors?.firstName?.message}
                placeholder="First Name"
                size="large"
                required
              />
            </Col>
            <Col xs={24} xl={12}>
              <SCInput
                register={register}
                name="lastName"
                control={control}
                label="Last Name"
                parentClass="flex-grow mb-4"
                error={errors?.lastName?.message}
                placeholder="Last Name"
                size="large"
                required
              />
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={12}>
              <SCInput
                register={register}
                name="email"
                control={control}
                label="Email"
                parentClass="flex-grow mb-4"
                error={errors?.email?.message}
                placeholder="Email"
                size="large"
                required
              />
            </Col>
            <Col xs={24} xl={12}>
              <SCInput
                register={register}
                name="phone"
                control={control}
                label="Phone"
                parentClass="flex-grow mb-4"
                error={errors?.phone?.message}
                placeholder="Phone"
                size="large"
                required
              />
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={12}>
              <SCInput
                register={register}
                name="dateOfBirth"
                control={control}
                label="Date of Birth"
                parentClass="flex-grow mb-4"
                error={errors?.dateOfBirth?.message}
                placeholder="Date of Birth"
                size="large"
                required
              />
            </Col>
            <Col xs={24} xl={12}>
              {/* Use Controller to manage the Select component */}
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    {...field}
                    allowClear
                    placeholder="Select Gender"
                    style={{ width: '100%' }}
                    onChange={(value) => field.onChange(value)}
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                )}
              />
              {/* Display validation error for gender if any */}
              {errors.gender && (
                <span className="text-red-500 text-sm">
                  {errors.gender.message}
                </span>
              )}
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={12}>
              {/* Example of another Select component using Controller */}
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    {...field}
                    allowClear
                    placeholder="Select Role"
                    style={{ width: '100%' }}
                    onChange={(value) => field.onChange(value)}
                  >
                    <Option value="admin">Admin</Option>
                    <Option value="superadmin">SuperAdmin</Option>
                    <Option value="manager">Manager</Option>
                    {/* Add more roles as needed */}
                  </Select>
                )}
              />
              {errors.role && (
                <span className="text-red-500 text-sm">
                  {errors.role.message}
                </span>
              )}
            </Col>
          </Row>
          <Row>
            <div className="flex mt-4">
              <Button
                loading={loading}
                htmlType="submit"
                type="primary"
                size="large"
              >
                {id ? 'Update' : 'Create'}
              </Button>
              <Button
                onClick={() => router.push('/users')}
                className="ml-4"
                size="large"
              >
                Cancel
              </Button>
            </div>
          </Row>
        </form>
      </Suspense>
    </div>
  );
};

export default AddUserForm;

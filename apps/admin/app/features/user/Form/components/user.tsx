import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Button, Col, Row, notification, Select } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UserSchema from '../validation'; // Assuming there's a validation schema for User
import SCSelect from 'apps/admin/components/SCForm/SCSelect';
import { addUser } from 'apps/admin/app/api/User';

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
  const id = searchParams.get('id');

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

  const onSubmit: SubmitHandler<User> = async (data) => {
    setLoading(true);
    addUser({ data })
      .then((response) => {
        if (response.status === 201) {
          router.push('/user');
          notification.success({
            message: response.data.message,
          });
        } else {
          notification.error({
            message: response.data.error(),
          });
        }
      })
      .catch((error) => {
        notification.error({ message: error.message });
      })
      .finally(() => {
        setLoading(false);
      });
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
                label="Date"
                parentClass="flex-grow mb-4"
                error={errors?.dateOfBirth?.message}
                placeholder="Date of Birth"
                size="large"
                required
              />
            </Col>
            <Col xs={24} xl={12}>
              <Select
                defaultValue=""
                style={{ width: '100%' }}
                onChange={(value) => setValue('gender', value)} // Use setValue to update the 'gender' field
              >
                <Option value="">Select Gender</Option>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
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
                htmlType="submit"
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

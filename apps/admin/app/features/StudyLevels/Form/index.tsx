import React, { useEffect, useState } from 'react';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

// API and components
import {
  fetchCourseCategoriesById,
  fetchStudyLevelsById,
  updateCourseCategoriesById,
  updateStudyLevelsById,
} from 'apps/admin/app/api/Course';
import JTLoader from 'apps/admin/components/SCLoader';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';

interface IFormData {
  level: string;
}

const StudyLevelsForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFormData>();

  // Fetch existing category data
  useEffect(() => {
    const fetchStudyLevel = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetchStudyLevelsById(id);
        const { name } = response.data;
        setValue('level', name);
      } catch (error) {
        console.error('Fetch Error:', error);
        notification.error({ message: 'Failed to fetch category data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchStudyLevel();
  }, [id, setValue]);

  // Form Submit Handler
  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (!data.level) {
      notification.error({ message: 'Please enter a Level.' });
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        id,
        name: data.level,
      };

      const response = await updateStudyLevelsById(updatedData);

      if (response?.status === 200) {
        notification.success({ message: 'Study Level  updated successfully.' });
        router.push('/study-levels');
      } else {
        throw new Error(response?.data?.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('Update Error:', error);
      notification.error({ message: error.message || 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <JTLoader visible={loading} />
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 pb-8">
        <h3 className="text-xl font-bold mt-7 py-8">Edit Study Level</h3>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="level"
              control={control}
              label="level"
              error={errors?.level?.message}
              placeholder="Enter Level"
              size="large"
              required
            />
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
              Update
            </Button>
          </div>
        </Row>
      </form>
    </div>
  );
};

export default StudyLevelsForm;

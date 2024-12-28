import React, { useEffect, useState } from 'react';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

// API and components
import {
  fetchCourseCategoriesById,
  updateCourseCategoriesById,
} from 'apps/admin/app/api/Course';
import JTLoader from 'apps/admin/components/SCLoader';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';

interface IFormData {
  courseCategory: string;
  icon: string;
}

const CourseCategoryForm: React.FC = () => {
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
    const fetchCategory = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetchCourseCategoriesById(id);
        const { courseCategory, icon } = response.data;
        setValue('courseCategory', courseCategory);
        setUploadedImageUrl(icon);
      } catch (error) {
        console.error('Fetch Error:', error);
        notification.error({ message: 'Failed to fetch category data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, setValue]);

  // Image Upload Handler
  const handleImageUpload = (urls: any) => {
    setUploadedImageUrl(urls); // Assuming single image upload
  };

  // Form Submit Handler
  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (!data.courseCategory) {
      notification.error({ message: 'Please enter a category name.' });
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        id,
        courseCategory: data.courseCategory,
        icon: uploadedImageUrl,
      };

      const response = await updateCourseCategoriesById(updatedData);

      if (response?.status === 200) {
        notification.success({ message: 'Category updated successfully.' });
        router.push('/course-category');
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
        <h3 className="text-xl font-bold mt-7 py-8">Edit Course Category</h3>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="courseCategory"
              control={control}
              label="Course Category"
              error={errors?.courseCategory?.message}
              placeholder="Enter Category Name"
              size="large"
              required
            />
          </Col>
        </Row>

        <Row>
          <SCUpload
            register={register}
            name="icon"
            control={control}
            label="Icon"
            error={errors?.icon?.message}
            required
            onFileUpload={handleImageUpload}
          />
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

export default CourseCategoryForm;

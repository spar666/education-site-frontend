import React, { useEffect, useState } from 'react';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  fetchCourseCategoriesById,
  updateCourseCategoriesById,
} from 'apps/admin/app/api/Course';
import JTLoader from 'apps/admin/components/SCLoader';
import SCInput from 'apps/admin/components/SCForm/SCInput';

interface ICategory {
  id: string;
  courseCategory: string;
}

interface IFormData {
  courseCategory: string;
}

const CourseCategoryForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // Initialize the react-hook-form with type for form data
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFormData>();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        if (id) {
          const response = await fetchCourseCategoriesById(id);
          const fetchedCategory: ICategory = response.data;

          // Setting initial form values using RHF's setValue method
          setValue('courseCategory', fetchedCategory.courseCategory);
        }
      } catch (error) {
        console.error('Error fetching course category:', error);
        notification.error({ message: 'Failed to fetch course category' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, setValue]);

  const UpdateSubmit: SubmitHandler<IFormData> = async (data) => {
    if (!data.courseCategory) {
      notification.error({ message: 'Please enter a category' });
      return;
    }

    setLoading(true);
    try {
      const updatedCategory = {
        id,
        courseCategory: data.courseCategory,
      };

      console.log(updatedCategory, 'Updating category');

      const response = await updateCourseCategoriesById(updatedCategory);

      if (response?.status === 200) {
        notification.success({ message: 'Category updated successfully' });
        router.push('/course-category');
      } else {
        notification.warning({
          message: response?.data?.message || 'Error updating category',
        });
      }
    } catch (error: any) {
      console.error('Error updating course category:', error);
      notification.error({
        message: error.message || 'Failed to update category',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <JTLoader visible={loading} />
      <form
        onSubmit={handleSubmit(UpdateSubmit)}
        className="bg-white px-8 pb-8"
      >
        <h3 className="text-xl font-bold mt-7 py-8 m-0">
          Edit Course Category
        </h3>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="courseCategory" // Mapping to the form field 'courseCategory'
              control={control}
              label="Course Category"
              parentClass="flex-grow mb-4"
              error={errors?.courseCategory?.message}
              placeholder="Course Category"
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

export default CourseCategoryForm;

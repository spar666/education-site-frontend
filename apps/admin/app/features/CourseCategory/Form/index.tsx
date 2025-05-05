'use client';

import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadFile } from 'antd/es/upload/interface';

// API and components
import {
  fetchCourseCategoriesById,
  updateCourseCategoriesById,
} from 'apps/admin/app/api/Course';
import JTLoader from 'apps/admin/components/SCLoader';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import { renderImage } from 'libs/services/helper';

// Zod schema for form validation
const CourseCategorySchema = z.object({
  courseCategory: z.string().min(1, 'Course category is required'),
  icon: z
    .array(
      z.object({
        uid: z.string(),
        name: z.string(),
        status: z.enum(['uploading', 'done', 'error', 'removed']),
        url: z.string(),
        thumbUrl: z.string().optional(),
        size: z.number().optional(),
        type: z.string().optional(),
        percent: z.number().optional(),
        originFileObj: z.any().optional(),
        response: z.any().optional(),
        error: z.any().optional(),
        publicId: z.string().optional(),
      })
    )
    .min(1, 'Icon is required'),
});

type CourseCategoryFormData = z.infer<typeof CourseCategorySchema>;

// Define API response interface
interface CourseCategoryResponse {
  data: {
    courseCategory: string;
    icon: string;
  };
}

// Define API error type
interface ApiError {
  message: string;
  status?: number;
}

// Define API payload for update
interface UpdateCourseCategoryPayload {
  id: string;
  courseCategory: string;
  icon: string;
}

// Type definitions for API functions
interface FetchCourseCategoriesByIdParams {
  id: string;
}

// Define CourseCategoryForm props (for future extensibility)
interface CourseCategoryFormProps {}

// Helper function to map size to dimensions (consistent with previous components)
const getImageDimensions = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'lg':
      return { width: 1200, height: 800 }; // Adjust dimensions as needed
    case 'md':
      return { width: 800, height: 600 };
    case 'sm':
      return { width: 400, height: 300 };
    default:
      return { width: 1200, height: 800 }; // Fallback
  }
};

const CourseCategoryForm: React.FC<CourseCategoryFormProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourseCategoryFormData>({
    resolver: zodResolver(CourseCategorySchema),
    defaultValues: {
      courseCategory: '',
      icon: [],
    },
  });

  // Fetch existing category data
  const fetchCategory = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response: CourseCategoryResponse = await fetchCourseCategoriesById(
        id
      );
      const { courseCategory, icon } = response.data;

      setValue('courseCategory', courseCategory);

      if (icon) {
        const imageFile: any = {
          uid: icon,
          name: icon.split('/').pop() || 'category-icon',
          status: 'done',
          url: renderImage({
            imgPath: icon,
            ...getImageDimensions('lg'), // Map size to dimensions
          }),
          publicId: icon,
        };
        setValue('icon', [imageFile]);
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error('Fetch Error:', err);
      notification.error({
        message: err.message || 'Failed to fetch category data',
        description: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  // Image Upload Handler
  const handleImageUpload = useCallback(
    (publicId: string) => {
      const newImage: any = {
        uid: publicId,
        name: publicId.split('/').pop() || 'category-icon',
        status: 'done',
        url: renderImage({
          imgPath: publicId,
          ...getImageDimensions('lg'), // Map size to dimensions
        }),
        publicId,
      };
      setValue('icon', [newImage]);
      notification.success({
        message: 'Upload Successful',
        description: 'Category icon has been uploaded',
      });
    },
    [setValue]
  );

  // Form Submit Handler
  const onSubmit: SubmitHandler<CourseCategoryFormData> = async (data) => {
    if (!id) {
      notification.error({
        message: 'Validation Error',
        description: 'Category ID is missing.',
      });
      return;
    }

    setLoading(true);
    try {
      const payload: UpdateCourseCategoryPayload = {
        id,
        courseCategory: data.courseCategory,
        icon: data.icon[0].publicId!, // Non-null assertion since schema ensures icon exists
      };

      const response = await updateCourseCategoriesById(payload);

      if (response?.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Category updated successfully.',
        });
        router.push('/course-category');
      } else {
        notification.warning({
          message: 'Warning',
          description: 'Operation completed with warnings.',
        });
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      notification.error({
        message: err.message || 'Error',
        description: 'Update failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Safely get the icon value
  const iconValue = watch('icon') || [];

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <JTLoader visible={loading} />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 pb-8">
        <h3 className="text-xl font-bold mt-7 py-8">Edit Course Category</h3>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="courseCategory"
              control={control as Control<CourseCategoryFormData>}
              label="Course Category"
              error={errors.courseCategory?.message}
              placeholder="Enter Category Name"
              size="large"
              required
            />
          </Col>
        </Row>

        <Row gutter={[20, 20]} className="mt-4">
          <Col xs={24}>
            <SCUpload
              name="icon"
              control={control as Control<CourseCategoryFormData>}
              label="Icon"
              error={
                errors.icon && 'message' in errors.icon
                  ? errors.icon.message
                  : undefined
              }
              cropAspect={1}
              folder="courseCategory"
              onFileUpload={handleImageUpload}
              multiple={false}
              defaultFileList={Array.isArray(iconValue) ? iconValue : []}
              required
            />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Button
              loading={loading}
              htmlType="submit"
              type="primary"
              size="large"
            >
              Update
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default CourseCategoryForm;

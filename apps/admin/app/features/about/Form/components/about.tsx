'use client';

import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg/index';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import { renderImage } from 'libs/services/helper';
import {
  addAboutUs,
  fetchAboutUsById,
  updateAboutUs,
} from 'apps/admin/app/api/AboutUs';
import AboutUsSchema from '../validation';

// Define UploadFile interface (aligned with SCUpload and BannerForm)
interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  url: string;
  thumbUrl?: string;
  size?: number;
  type?: string;
  percent?: number;
  originFileObj?: File;
  response?: any;
  error?: any;
  publicId?: string;
}

// Define AboutResponse interface
interface AboutResponse {
  data: {
    id?: string;
    title: string;
    contents: string;
    coverImage: string;
    status?: number;
    message?: string;
  };
}

// Define API error type
interface ApiError {
  message: string;
  status?: number;
}

// Define AboutPayload for API calls
interface AboutPayload {
  id?: string;
  title: string;
  contents: string;
  coverImage: string;
}

// Type definitions for API functions
interface FetchAboutUsByIdParams {
  id: string;
}

// Define AboutForm props (for future extensibility)
interface AboutFormProps {}

// Helper function to map size to dimensions (same as BlogForm and BannerForm)
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

const AboutForm: React.FC<AboutFormProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState<boolean>(false);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(AboutUsSchema),
    defaultValues: {
      title: '',
      contents: '',
      coverImage: [],
    },
  });

  useEffect(() => {
    if (id) {
      fetchAboutUsById({ id })
        .then((response: AboutResponse) => {
          const { data } = response;
          setCoverImageId(data.coverImage || null);

          const formattedCover: UploadFile[] = data.coverImage
            ? [
                {
                  uid: data.coverImage,
                  name: data.coverImage.split('/').pop() || 'about-image',
                  status: 'done',
                  url: renderImage({
                    imgPath: data.coverImage,
                    ...getImageDimensions('lg'), // Map size to dimensions
                  }),
                },
              ]
            : [];

          reset({
            title: data.title,
            contents: data.contents,
            coverImage: formattedCover,
          });
        })
        .catch((error: ApiError) => {
          console.error('Error fetching about us:', error);
          notification.error({
            message: error.message || 'Failed to load about us data',
          });
        });
    }
  }, [id, reset]);

  const handleCoverImageUpload = useCallback((publicId: string) => {
    setCoverImageId(publicId);
    notification.success({
      message: 'Upload Successful',
      description: 'Cover image has been uploaded',
    });
  }, []);

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true);

    const payload: AboutPayload = {
      title: data.title,
      contents: data.contents,
      coverImage: coverImageId || data.coverImage[0]?.uid || '',
      ...(id && { id }),
    };

    try {
      const response: AboutResponse = id
        ? await updateAboutUs(payload)
        : await addAboutUs({ data: payload });

      if (response.data.status === 201) {
        notification.success({
          message: response.data.message || 'Operation successful',
        });
        router.push('/about');
      } else {
        notification.warning({
          message: response.data.message || 'Operation completed with warnings',
        });
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      notification.error({
        message: err.message || 'An error occurred while saving',
      });
    } finally {
      setLoading(false);
    }
  };

  // Safely get the coverImage value
  const coverImageValue = watch('coverImage') || [];

  return (
    <div className="bg-white px-8 pb-8">
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Create'} About
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={12}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="title"
              control={control as Control<any>}
              label="Title"
              parentClass="flex-grow mb-4"
              error={errors?.title?.message}
              placeholder="Title"
              size="large"
              required
            />
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} xl={12}>
            <SCWysiwyg
              name="contents"
              register={register}
              control={control as Control<any>}
              parentClass="flex-grow mb-4"
              label="Contents"
              error={errors?.contents?.message}
            />
          </Col>
        </Row>

        <Row>
          <SCUpload
            name="coverImage"
            control={control as Control<any>}
            label="Cover Photo"
            error={
              errors.coverImage && 'message' in errors.coverImage
                ? errors.coverImage.message
                : undefined
            }
            cropAspect={16 / 9}
            folder="about"
            onFileUpload={handleCoverImageUpload}
            multiple={false}
            defaultFileList={
              Array.isArray(coverImageValue) ? coverImageValue : []
            }
            required
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
              {id ? 'Update' : 'Create'}
            </Button>
            <Button
              onClick={() => router.push('/about')}
              className="ml-4"
              size="large"
            >
              Cancel
            </Button>
          </div>
        </Row>
      </form>
    </div>
  );
};

export default AboutForm;

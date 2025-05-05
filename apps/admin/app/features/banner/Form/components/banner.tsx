'use client';

import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg/index';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import {
  addBanner,
  fetchBannerById,
  updateBanner,
} from 'apps/admin/app/api/Banner';
import { renderImage } from 'libs/services/helper';
import BannerSchema from '../validation';

// Define UploadFile interface
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
}

// Define BannerResponse interface
interface BannerResponse {
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

// Define BannerPayload for API calls
interface BannerPayload {
  id?: string;
  title: string;
  contents: string;
  coverImage: string;
}

// Type definitions for API functions
interface FetchBannerByIdParams {
  id: string;
}

// Define BannerForm props (for future extensibility)
interface BannerFormProps {}

// Helper function to map size to dimensions (same as BlogForm)
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

const BannerForm: React.FC<BannerFormProps> = () => {
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
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      title: '',
      contents: '',
      coverImage: [],
    },
  });

  useEffect(() => {
    if (id) {
      fetchBannerById({ id })
        .then((response: BannerResponse) => {
          const { data } = response;
          setCoverImageId(data.coverImage || null);

          const formattedCover: UploadFile[] = data.coverImage
            ? [
                {
                  uid: data.coverImage,
                  name: data.coverImage.split('/').pop() || 'banner-image',
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
          console.error('Error fetching banner:', error);
          notification.error({
            message: error.message || 'Failed to load banner data',
          });
        });
    }
  }, [id, reset]);

  const handleCoverImageUpload = useCallback((publicId: string) => {
    setCoverImageId(publicId);
    notification.success({
      message: 'Upload Successful',
      description: 'Banner image has been uploaded',
    });
  }, []);

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true);

    const payload: BannerPayload = {
      title: data.title,
      contents: data.contents,
      coverImage: coverImageId || data.coverImage[0]?.uid || '',
      ...(id && { id }),
    };

    try {
      const response: BannerResponse = id
        ? await updateBanner(payload)
        : await addBanner({ data: payload });

      if (response.data.status === 201) {
        notification.success({
          message: response.data.message || 'Operation successful',
        });
        router.push('/banner');
      } else {
        notification.warning({
          message: response.data.message || 'Operation completed with warnings',
        });
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      notification.error({
        message: err.message || 'An error occurred while saving the banner',
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
        {id ? 'Edit' : 'Create'} Banner
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
            label="Banner Image"
            error={
              errors.coverImage && 'message' in errors.coverImage
                ? errors.coverImage.message
                : undefined
            }
            cropAspect={16 / 9}
            folder="banners"
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
              onClick={() => router.push('/banner')}
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

export default BannerForm;

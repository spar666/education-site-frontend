'use client';

import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadFile } from 'antd/es/upload/interface';
import JTLoader from 'apps/admin/components/SCLoader';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import {
  fetchDestinationById,
  updateDestinationById,
} from 'apps/admin/app/api/Destinations';
import { renderImage } from 'libs/services/helper';

// Zod schema for form validation
const DestinationSchema = z.object({
  destination: z.string().min(1, 'Destination name is required'),
  image: z
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
    .min(1, 'Image is required'),
});

type DestinationFormData = z.infer<typeof DestinationSchema>;

// Type definitions
interface DestinationResponse {
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    slug: string;
    image: string;
    createdAt: string | null;
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
    deletedAt: string | null;
    deletedBy: string | null;
    isActive: boolean;
    isDelete: boolean;
  };
}

interface ApiError {
  message: string;
  status?: number;
}

interface UpdateDestinationPayload {
  id: string;
  name: string;
  image: string;
}

// Helper function to map size to dimensions
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

// Main component
const DestinationForm: React.FC<any> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DestinationFormData>({
    resolver: zodResolver(DestinationSchema),
    defaultValues: {
      destination: '',
      image: [],
    },
  });

  // Fetch existing destination data
  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response: any = await fetchDestinationById(id);

        const { name, image } = response.data.data;

        if (!name || !image) {
          throw new Error('Invalid destination data received');
        }

        const formattedCover: any = image
          ? [
              {
                uid: image,
                name: image.split('/').pop() || 'destination-image',
                status: 'done',
                url: renderImage({
                  imgPath: image,
                  ...getImageDimensions('lg'), // Map size to dimensions
                }),
                publicId: image,
              },
            ]
          : [];

        reset({
          destination: name,
          image: formattedCover,
        });
      } catch (error: unknown) {
        const err = error as ApiError;
        notification.error({
          message: err.message || 'Failed to fetch destination data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id, reset]);

  // Image Upload Handler
  const handleImageUpload = useCallback(
    (publicId: string) => {
      const newImage: any = {
        uid: publicId,
        name: publicId.split('/').pop() || 'destination-image',
        status: 'done',
        url: renderImage({
          imgPath: publicId,
          ...getImageDimensions('lg'), // Map size to dimensions
        }),
        publicId,
      };
      setValue('image', [newImage]);
      notification.success({
        message: 'Upload Successful',
        description: 'Destination image has been uploaded',
      });
    },
    [setValue]
  );

  // Form Submit Handler
  const onSubmit: SubmitHandler<DestinationFormData> = async (data) => {
    if (!id) {
      notification.error({
        message: 'Validation Error',
        description: 'Destination ID is missing',
      });
      return;
    }

    setLoading(true);
    try {
      const updatedData: any = {
        id,
        name: data.destination,
        image: data.image[0].publicId!, // Non-null assertion since schema ensures image exists
      };

      const response = await updateDestinationById(updatedData);

      if (response?.status === 200) {
        notification.success({
          message: 'Destination updated successfully',
        });
        router.push('/destination');
      } else {
        throw new Error(response?.data?.message || 'Update failed');
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      notification.error({
        message: err.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // Safely get the image value
  const imageValue = watch('image') || [];

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <JTLoader visible={loading} />
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 pb-8">
        <h3 className="text-xl font-bold mt-7 py-8">Edit Destination</h3>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="destination"
              control={control}
              label="Destination"
              error={errors.destination?.message}
              placeholder="Enter Destination Name"
              size="large"
              required
            />
          </Col>
        </Row>

        <Row>
          <SCUpload
            name="image"
            control={control}
            label="Image"
            error={
              errors.image && 'message' in errors.image
                ? errors.image.message
                : undefined
            }
            cropAspect={1}
            folder="destination"
            onFileUpload={handleImageUpload}
            multiple={false}
            defaultFileList={imageValue}
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
              Update
            </Button>
          </div>
        </Row>
      </form>
    </div>
  );
};

export default DestinationForm;

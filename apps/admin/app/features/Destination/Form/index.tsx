'use client';

import { Button, Col, Row, notification, Input, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg';

// Zod schema for form validation
const DestinationSchema = z.object({
  destination: z.string().min(1, 'Destination name is required'),
  description: z.string().min(1, 'Description is required'),
  totalAverageCost: z.string().min(1, 'Total average cost is required'),
  totalLivingCost: z.string().min(1, 'Total living cost is required'),
  requirements: z
    .array(z.string().min(1, 'Requirement cannot be empty'))
    .min(1, 'At least one requirement is required'),
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
    description?: string;
    totalAverageCost?: string;
    totalLivingCost?: string;
    requirements?: string[];
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
  description?: string;
  totalAverageCost?: string;
  totalLivingCost?: string;
  requirements?: string[];
}

// Helper function to map size to dimensions
const getImageDimensions = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'lg':
      return { width: 1200, height: 800 };
    case 'md':
      return { width: 800, height: 600 };
    case 'sm':
      return { width: 400, height: 300 };
    default:
      return { width: 1200, height: 800 };
  }
};

// Main component
const DestinationForm: React.FC<any> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState<boolean>(false);
  const [requirements, setRequirements] = useState<
    { id: string; value: string }[]
  >([]);

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
      description: '',
      totalAverageCost: '',
      totalLivingCost: '',
      requirements: [],
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

        const {
          name,
          image,
          description,
          totalAverageCost,
          totalLivingCost,
          requirements,
        } = response.data.data;

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
                  ...getImageDimensions('lg'),
                }),
                publicId: image,
              },
            ]
          : [];

        reset({
          destination: name,
          description: description || '',
          totalAverageCost: totalAverageCost || '',
          totalLivingCost: totalLivingCost || '',
          requirements: requirements || [],
          image: formattedCover,
        });

        if (requirements) {
          setRequirements(
            requirements.map((req: string, index: number) => ({
              id: `req-${index}-${Date.now()}`,
              value: req,
            }))
          );
        }
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
          ...getImageDimensions('lg'),
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

  // Handle adding requirement
  const handleAddRequirement = () => {
    const newRequirement = {
      id: `req-${Date.now()}`,
      value: '',
    };
    setRequirements([...requirements, newRequirement]);
  };

  // Handle requirement change
  const handleRequirementChange = (id: string, value: string) => {
    const updatedRequirements = requirements.map((req) =>
      req.id === id ? { ...req, value } : req
    );
    setRequirements(updatedRequirements);
    updateFormRequirements(updatedRequirements);
  };

  // Handle removing requirement
  const handleRemoveRequirement = (id: string) => {
    const updatedRequirements = requirements.filter((req) => req.id !== id);
    setRequirements(updatedRequirements);
    updateFormRequirements(updatedRequirements);
  };

  // Update form requirements value
  const updateFormRequirements = (reqs: { id: string; value: string }[]) => {
    const validRequirements = reqs
      .map((req) => req.value.trim())
      .filter((value) => value !== '');
    setValue('requirements', validRequirements, { shouldValidate: true });
  };

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
        description: data.description,
        totalAverageCost: data.totalAverageCost,
        totalLivingCost: data.totalLivingCost,
        requirements: data.requirements,
        image: data.image[0].publicId!,
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <JTLoader visible={loading} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-sm max-w-5xl mx-auto"
      >
        <div className="border-b border-gray-200 px-8 py-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Edit Destination
          </h3>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <Row gutter={[24, 24]}>
              <Col xs={24} xl={12}>
                <SCInput
                  register={register}
                  name="destination"
                  control={control}
                  label="Destination Name"
                  error={errors.destination?.message}
                  placeholder="Enter Destination Name"
                  size="large"
                  required
                />
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <SCWysiwyg
                  register={register}
                  name="description"
                  control={control}
                  label="Description"
                  error={errors.description?.message}
                  placeholder="Enter destination description"
                  size="large"
                  required
                />
              </Col>
            </Row>
          </div>

          {/* Cost Information Section */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Cost Information
            </h4>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <SCInput
                  register={register}
                  name="totalAverageCost"
                  control={control}
                  label="Total Average Cost"
                  error={errors.totalAverageCost?.message}
                  placeholder="Enter Total Average Cost"
                  size="large"
                  required
                />
              </Col>
              <Col xs={24} md={12}>
                <SCInput
                  register={register}
                  name="totalLivingCost"
                  control={control}
                  label="Total Living Cost"
                  error={errors.totalLivingCost?.message}
                  placeholder="Enter Total Living Cost"
                  size="large"
                  required
                />
              </Col>
            </Row>
          </div>

          {/* Requirements Section */}
          <div className="border-t border-gray-100 pt-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Requirements <span className="text-red-500">*</span>
              </label>

              <div className="space-y-4 mb-4">
                {requirements.map((req) => (
                  <Space
                    key={req.id}
                    className="flex items-start w-full bg-white rounded-md p-2"
                  >
                    <Input.TextArea
                      value={req.value}
                      onChange={(e) =>
                        handleRequirementChange(req.id, e.target.value)
                      }
                      placeholder="Enter requirement"
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      className="flex-1"
                    />
                    <Button
                      type="text"
                      danger
                      icon={
                        <DeleteOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      }
                      onClick={() => handleRemoveRequirement(req.id)}
                      className="mt-1"
                    />
                  </Space>
                ))}
              </div>

              <Button
                type="dashed"
                onClick={handleAddRequirement}
                icon={
                  <PlusOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
                className="w-full"
              >
                Add Requirement
              </Button>

              {errors.requirements?.message && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.requirements.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-t border-gray-100 pt-6">
            <Row gutter={[24, 24]}>
              <Col xs={24} xl={12}>
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
              </Col>
            </Row>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex gap-4">
              <Button
                loading={loading}
                htmlType="submit"
                type="primary"
                size="large"
              >
                Update
              </Button>
              <Button
                type="default"
                size="large"
                onClick={() => router.push('/destination')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;

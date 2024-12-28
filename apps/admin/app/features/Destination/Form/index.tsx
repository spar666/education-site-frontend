import React, { useEffect, useState } from 'react';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import JTLoader from 'apps/admin/components/SCLoader';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import {
  fetchDestinationById,
  updateDestinationById,
} from 'apps/admin/app/api/Destinations';
import { renderImage } from 'libs/services/helper';

interface IFormData {
  destination: string;
  image: any;
}

const DestinationForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFormData>();

  // Fetch existing category data
  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetchDestinationById(id);
        const { name, image } = response.data;

        const formattedCover = [
          {
            uid: image,
            url: renderImage({
              imgPath: image,
              size: 'lg',
            }) as string,
          },
        ];

        reset({
          destination: name,
          image: formattedCover,
        });
      } catch (error) {
        console.error('Fetch Error:', error);
        notification.error({ message: 'Failed to fetch destination data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id, reset]);

  // Image Upload Handler
  const handleImageUpload = (urls: any) => {
    setUploadedImageUrl(urls); // Assuming single image upload
  };

  // Form Submit Handler
  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setLoading(true);
    try {
      const updatedData = {
        id,
        image: uploadedImageUrl,
      };

      const response = await updateDestinationById(updatedData);

      if (response?.status === 200) {
        notification.success({ message: 'Destination updated successfully.' });
        router.push('/destination');
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
        <h3 className="text-xl font-bold mt-7 py-8">Edit Destination</h3>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="destination"
              control={control}
              label="Destination"
              error={errors?.destination?.message}
              placeholder="Enter Destination Name"
              size="large"
              required
            />
          </Col>
        </Row>

        <Row>
          <SCUpload
            register={register}
            name="image"
            control={control}
            label="image"
            error={errors?.image?.message}
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

export default DestinationForm;

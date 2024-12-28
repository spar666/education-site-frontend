'use client';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import BlogSchema from '../validation';
import { addBlog, fetchBlogById, updateBlog } from 'apps/admin/app/api/Blogs';
import { zodResolver } from '@hookform/resolvers/zod';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg/index';
import { addFaq, fetchFaqById, updateFaq } from 'apps/admin/app/api/FAQ';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import {
  addBanner,
  fetchBannerById,
  updateBanner,
} from 'apps/admin/app/api/Banner';
import { renderImage } from 'libs/services/helper';
import BannerSchema from '../validation';

interface ICreate {
  title: string;
  contents: string;
  coverImage: string;
}

function BannerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [bannerCoverImage, setBannerCoverImage] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(BannerSchema),
  });
  useEffect(() => {
    if (id) {
      fetchBannerById({ id })
        .then((response) => {
          setBannerCoverImage(response.data.coverImage || '');
          const cover = response.data.coverImage;
          const formattedCover = [
            {
              uid: cover,
              url: renderImage({ imgPath: cover, size: 'lg' }),
            },
          ];
          reset({
            title: response.data.title,
            contents: response.data.contents,
            coverImage: formattedCover,
          });
        })
        .catch((error) => {
          console.error('Error fetching banner:', error);
        });
    }
  }, [id, reset]);

  let coverImageUrl: any;
  if (uploadedImageUrls.length > 0) {
    coverImageUrl = uploadedImageUrls;
  } else {
    coverImageUrl = bannerCoverImage;
  }

  const handleImageUpload = (urls: string[]) => {
    setUploadedImageUrls(urls);
  };

  const BannerHandler = async (data: any) => {
    setLoading(true);

    if (id) {
      const updatedData = {
        ...data,
        id: id,
        title: data?.title || '',
        contents: data?.contents || '',
      };

      // Only update coverImage if new coverImage is provided
      if (data.coverImage) {
        updatedData.coverImage = coverImageUrl;
      }

      updateBanner(updatedData)
        .then((response) => {
          if (response.data.status === 201) {
            router.push('/banner');
            notification.success({
              message: response.data.message,
            });
          } else {
            notification.warning({
              message: response.data.message,
            });
          }
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    } else {
      data.coverImage = coverImageUrl;
      addBanner({ data })
        .then((response) => {
          if (response.data.status === 201) {
            router.push('/banner');
            notification.success({
              message: response.data.message,
            });
          } else {
            notification.error({
              message: response.data.createBlog.error(),
            });
          }
        })
        .catch((error) => {
          notification.error({ message: error.message });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(BannerHandler)}
        className="bg-white px-8 pb-8"
      >
        <h3 className="text-xl font-bold mt-7  py-8 m-0">
          {id ? 'Edit' : 'Create'} Banner
        </h3>
        <Row gutter={12}>
          <Col xs={24} xl={12}>
            <SCInput
              register={register}
              name="title"
              control={control}
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
              control={control}
              parentClass="flex-grow mb-4"
              label="Contents"
              error={errors?.contents?.message}
            />
          </Col>
        </Row>

        <Row>
          <SCUpload
            register={register}
            name="coverImage"
            control={control as any}
            label="Cover Photo"
            error={errors?.coverImage?.message}
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
              {id ? 'Update' : 'Create'}
            </Button>
            <Button
              htmlType="submit"
              onClick={() => router.push('/banner')}
              className="ml-4"
              size="large"
            >
              Cancel
            </Button>
          </div>
        </Row>
      </form>
    </>
  );
}

export default BannerForm;

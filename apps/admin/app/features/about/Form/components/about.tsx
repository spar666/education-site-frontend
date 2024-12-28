'use client';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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

interface ICreate {
  title: string;
  contents: string;
  coverImage: string;
}

function AboutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [aboutUsCoverImage, setAboutUsCoverImage] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(AboutUsSchema),
  });
  useEffect(() => {
    if (id) {
      fetchAboutUsById({ id })
        .then((response) => {
          setAboutUsCoverImage(response.data.coverImage || '');
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
          console.error('Error fetching faq:', error);
        });
    }
  }, [id, reset]);

  let coverImageUrl: any;
  if (uploadedImageUrls.length > 0) {
    coverImageUrl = uploadedImageUrls;
  } else {
    coverImageUrl = aboutUsCoverImage;
  }

  const handleImageUpload = (urls: string[]) => {
    setUploadedImageUrls(urls);
  };

  const AboutUsHandler = async (data: any) => {
    setLoading(true);

    // Update or add the blog

    if (id) {
      const updatedData = {
        ...data,
        id: id,
        question: data?.question || '',
        answer: data?.answer || '',
      };

      // Only update coverImage if new coverImage is provided
      if (data.coverImage) {
        updatedData.coverImage = coverImageUrl;
      }

      updateAboutUs(updatedData)
        .then((response) => {
          if (response.data.status === 201) {
            router.push('/about');
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
      addAboutUs({ data })
        .then((response) => {
          if (response.data.status === 201) {
            router.push('/about');
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
        onSubmit={handleSubmit(AboutUsHandler)}
        className="bg-white px-8 pb-8"
      >
        <h3 className="text-xl font-bold mt-7  py-8 m-0">
          {id ? 'Edit' : 'Create'} About
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
              onClick={() => router.push('/about')}
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

export default AboutForm;

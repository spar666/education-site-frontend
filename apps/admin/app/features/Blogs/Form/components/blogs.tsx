'use client';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import BlogSchema from '../validation';
import { quillValidate } from 'apps/admin/helper/quillValidate';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import { addBlog, fetchBlogById, updateBlog } from 'apps/admin/app/api/Blogs';
import { zodResolver } from '@hookform/resolvers/zod';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCSelect from 'apps/admin/components/SCForm/SCSelect';
import SCTextArea from 'apps/admin/components/SCForm/SCTextArea';
import { renderImage } from 'libs/services/helper';
import dynamic from 'next/dynamic';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg/nossr';

interface ICreate {
  title: string;
  tags: string[];
  slug: string;
  metaTitle: string;
  metaDescription: string;
  schemaMarkup: string;
  author: string;
  contents: string;
  coverImage: string;
  images: string[];
}

function BlogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [authorId, setAuthorId] = useState(null);
  const [blogCoverImage, setBlogCoverImage] = useState<string | undefined>(
    undefined
  );
  const [blogContentImage, setBlogContentImage] = useState<string[]>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(BlogSchema),
  });
  useEffect(() => {
    if (id) {
      fetchBlogById({ id })
        .then((response) => {
          setBlogCoverImage(response.data.coverImage || '');
          setBlogContentImage(response.data.images || []);

          const cover = response.data.coverImage;
          const contentsImages = [response.data.images];
          const formattedCover = [
            {
              uid: cover,
              url: renderImage({ imgPath: cover, size: 'lg' }),
            },
          ];

          const formattedGallery = contentsImages?.map((item) => {
            return {
              uid: item,
              url: renderImage({ imgPath: item, size: 'lg' }),
            };
          });
          setAuthorId(response.data.author.id);
          reset({
            title: response.data.title,
            tags: response.data.tags,
            slug: response.data.slug,
            metaTitle: response.data.metaTitle,
            metaDescription: response.data.metaDescription,
            schemaMarkup: response.data.schemaMarkup,
            contents: response.data.contents,
            coverImage: formattedCover,
            images: formattedGallery,
            author: response.data.author.id,
          });
        })
        .catch((error) => {
          console.error('Error fetching blog:', error);
        });
    }
  }, [id, reset]);

  let coverImageUrl: any, contentImageUrl: any;
  if (uploadedImageUrls.length > 0) {
    coverImageUrl = uploadedImageUrls;
    contentImageUrl = [uploadedImageUrls];
  } else {
    coverImageUrl = blogCoverImage;
    contentImageUrl = [blogContentImage];
  }

  console.log(coverImageUrl, 'coverimage');

  console.log(contentImageUrl, 'contentimageurl');

  const blogHandler = async (data: any) => {
    setLoading(true);

    // Update or add the blog

    if (id) {
      const updatedData = {
        ...data,
        id: id,
        slug: data?.slug || '',
        author: authorId,
      };

      // Only update coverImage if new coverImage is provided
      if (data.coverImage) {
        updatedData.coverImage = coverImageUrl;
      }

      // Only update images if new images are provided
      if (data.images && data.images.length > 0) {
        updatedData.images = contentImageUrl;
      }

      updateBlog(updatedData)
        .then((response) => {
          if (response.data.status === 201) {
            router.push('/blogs');
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
      data.images = contentImageUrl;

      console.log(data, 'for upload');
      addBlog({ data })
        .then((response) => {
          if (response.data.status === 201) {
            router.push('/blogs');
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

  const handleImageUpload = (urls: string[]) => {
    setUploadedImageUrls(urls);
  };

  return (
    <>
      <form onSubmit={handleSubmit(blogHandler)} className="bg-white px-8 pb-8">
        <h3 className="text-xl font-bold mt-7  py-8 m-0">
          {id ? 'Edit' : 'Create'} Blog
        </h3>
        <Row gutter={[20, 20]}>
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
          <Col xs={24} xl={12}>
            <SCSelect
              register={register}
              parentClass="flex-grow mb-4"
              name="tags"
              control={control as any}
              label="Tags"
              error={errors?.tags?.message}
              allowClear
              placeholder="Please select"
              size="large"
              mode="tags"
              notFoundContent={null}
              options={[]}
            />
          </Col>
        </Row>
        <Row gutter={[20, 20]}>
          <Col xs={12}>
            <SCInput
              register={register}
              parentClass="flex-grow mb-4"
              name="slug"
              control={control as any}
              label="Slug"
              error={errors?.slug?.message}
              placeholder="title-in-this-format"
              size="large"
            />
          </Col>
        </Row>
        <Row gutter={[0, 0]}>
          <Col xs={24} xl={24}>
            <SCInput
              register={register}
              parentClass="flex-grow mb-4"
              name="metaTitle"
              control={control as any}
              label="Meta Title"
              error={errors?.metaTitle?.message}
              placeholder="Meta Title"
              size="large"
            />
          </Col>
          <Col xs={24} xl={24}>
            <SCTextArea
              register={register}
              name="metaDescription"
              parentClass="flex-grow mb-4"
              control={control as any}
              label="Meta Description"
              error={errors?.metaDescription?.message}
              allowClear
              placeholder="Meta Description"
              size="large"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} xl={24}>
            <SCTextArea
              register={register}
              rows={7}
              name="schemaMarkup"
              parentClass="flex-grow mb-4"
              control={control}
              label="Schema Markup"
              error={errors?.schemaMarkup?.message}
              allowClear
              placeholder="Schema Markup for SEO"
              size="large"
            />
          </Col>
        </Row>
        <Row gutter={[20, 20]}>
          <Col xs={24}>
            <SCWysiwyg
              register={register}
              name="contents"
              control={control as any}
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
          <SCUpload
            register={register}
            name="images"
            control={control as any}
            label="Contents Images"
            multiple
            error={errors?.images?.message}
            cropAspect={2 / 2}
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
              onClick={() => router.push('/blogs')}
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

export default BlogForm;

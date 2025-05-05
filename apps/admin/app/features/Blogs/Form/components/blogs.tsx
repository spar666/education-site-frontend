'use client';

import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BlogSchema from '../validation';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import { addBlog, fetchBlogById, updateBlog } from 'apps/admin/app/api/Blogs';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCSelect from 'apps/admin/components/SCForm/SCSelect';
import SCTextArea from 'apps/admin/components/SCForm/SCTextArea';
import { renderImage } from 'libs/services/helper';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg/index';

// Define UploadFile interface
interface UploadFile {
  uid: string;
  url: string;
  name?: string;
  status?: string;
  publicId?: string;
}

// Define BlogResponse interface
interface BlogResponse {
  data: {
    id?: string;
    title: string;
    tags: string[];
    slug: string;
    metaTitle: string;
    metaDescription: string;
    schemaMarkup: string;
    author: { id: string };
    contents: string;
    coverImage: string;
    images: string[];
    status?: number;
    message?: string;
  };
}

// Define API error type
interface ApiError {
  message: string;
  status?: number;
}

// Define BlogPayload for API calls
interface BlogPayload {
  id?: string;
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

// Type definitions for API functions
interface FetchBlogByIdParams {
  id: string;
}

// Define BlogForm props
interface BlogFormProps {}

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

const BlogForm: React.FC<BlogFormProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState<boolean>(false);
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [blogCoverImage, setBlogCoverImage] = useState<string | null>(null);
  const [blogContentImages, setBlogContentImages] = useState<string[]>([]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: '',
      tags: [],
      slug: '',
      metaTitle: '',
      metaDescription: '',
      schemaMarkup: '',
      author: '',
      contents: '',
      coverImage: [],
      images: [],
    },
  });

  useEffect(() => {
    if (id) {
      fetchBlogById({ id })
        .then((response: BlogResponse) => {
          const { data } = response;
          setBlogCoverImage(data.coverImage || null);
          setBlogContentImages(data.images || []);
          setAuthorId(data.author.id);

          const formattedCover: UploadFile[] = data.coverImage
            ? [
                {
                  uid: data.coverImage,
                  url: renderImage({
                    imgPath: data.coverImage,
                    ...getImageDimensions('lg'), // Map size to dimensions
                  }),
                },
              ]
            : [];

          const formattedGallery: UploadFile[] =
            data.images?.map((item: string) => ({
              uid: item,
              url: renderImage({
                imgPath: item,
                ...getImageDimensions('lg'), // Map size to dimensions
              }),
            })) || [];

          reset({
            title: data.title,
            tags: data.tags,
            slug: data.slug,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            schemaMarkup: data.schemaMarkup,
            contents: data.contents,
            coverImage: formattedCover,
            images: formattedGallery,
            author: data.author.id,
          });
        })
        .catch((error: ApiError) => {
          console.error('Error fetching blog:', error);
          notification.error({
            message: error.message || 'Failed to load blog data',
          });
        });
    }
  }, [id, reset]);

  const handleCoverImageUpload = useCallback((publicId: string) => {
    setBlogCoverImage(publicId);
    notification.success({
      message: 'Upload Successful',
      description: 'Blog cover image has been uploaded',
    });
  }, []);

  const handleContentImagesUpload = useCallback((publicIds: string[]) => {
    setBlogContentImages(publicIds);
    notification.success({
      message: 'Upload Successful',
      description: 'Content images have been uploaded',
    });
  }, []);

  const blogHandler: SubmitHandler<any> = async (data) => {
    setLoading(true);

    const payload: BlogPayload = {
      ...data,
      coverImage: blogCoverImage || data.coverImage[0]?.uid || '',
      images:
        blogContentImages.length > 0
          ? blogContentImages
          : data.images.map((img: any) => img.uid),
      ...(id && { id }),
      author: authorId || data.author,
    };

    try {
      const response: BlogResponse = id
        ? await updateBlog(payload)
        : await addBlog({ data: payload });

      if (response.data.status === 201) {
        notification.success({
          message: response.data.message || 'Operation successful',
        });
        router.push('/blogs');
      } else {
        notification.warning({
          message: response.data.message || 'Operation completed with warnings',
        });
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      notification.error({
        message: err.message || 'An error occurred while saving the blog',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-8 pb-8">
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Create'} Blog
      </h3>
      <form onSubmit={handleSubmit(blogHandler)}>
        <Row gutter={[20, 20]}>
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
          <Col xs={24} xl={12}>
            <SCSelect
              register={register}
              parentClass="flex-grow mb-4"
              name="tags"
              control={control as Control<any>}
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
              control={control as Control<any>}
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
              control={control as Control<any>}
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
              control={control as Control<any>}
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
              control={control as Control<any>}
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
            error={errors.coverImage?.message}
            cropAspect={1}
            folder="blog"
            onFileUpload={handleCoverImageUpload}
            multiple={false}
            defaultFileList={watch('coverImage')}
            required
          />
        </Row>
        {/* <Row>
          <SCUpload
            name="images"
            control={control as Control<any>}
            label="Content Images"
            error={errors.images?.message}
            folder="blog/content"
            onFileUpload={handleContentImagesUpload}
            multiple={true}
            defaultFileList={watch('images')}
          />
        </Row> */}
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
              onClick={() => router.push('/blogs')}
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

export default BlogForm;

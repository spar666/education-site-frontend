import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Divider, Row } from 'antd';
import ProgressiveImageLoading from 'apps/student/components/ProgressiveImage';
import NameFormatter from '../../../../../libs/NameFormatter';
import { EyeIcon } from 'lucide-react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { fetchBlogBySlug } from '../../api/blog';
import { renderImage } from 'libs/services/helper';
import Image from 'next/image';

interface IBlog {
  id: string;
  title: string;
  contents: string;
  coverImage: string;
  images: string;
  tags: string[];
  slug: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const BlogDetails = ({ searchParams }: any) => {
  const { blog } = searchParams;
  console.log(blog, 'blog');
  const [blogData, setBlogData] = useState<IBlog>();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response: any = await fetchBlogBySlug({ blog });
        console.log(response, 'response');
        setBlogData(response.data);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      }
    };
    fetchBlog();
  }, [blog]);

  return (
    <section className="container a-style">
      <MaxWidthWrapper>
        <section className={'py-5 bg-gray-50'}>
          <div className="container mx-auto my-3">
            <Breadcrumb separator={'>'}>
              <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue">Blog</Breadcrumb.Item>
              <Breadcrumb.Item className="text-navy-blue">
                {blogData?.title}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </section>
        <Row className="mt-10" justify="center">
          {/* <div style={{ maxWidth: '1000px' }}>
            <Image
              src={renderImage({
                imgPath: blogData?.images || '',
                size: 'md',
              })}
              alt="University Image"
              layout="responsive" // Use responsive layout for full width
              objectFit="cover" // Maintain aspect ratio and cover container
              width={700} // Set the desired width
              height={400} // Set the desired height
              style={{ maxHeight: '700px' }} // Limit max height
            />
          </div> */}
        </Row>

        <Row gutter={[20, 20]} className="mt-10">
          <Col xs={24} sm={24} md={18} lg={18}>
            <div className="flex flex-col items-start gap-4">
              <div>
                {blogData?.tags?.map((item, index) => (
                  <span key={index} className="opacity-80 text-base pl-2">
                    #{item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-2xl text-dark-blue md:text-3xl mt-2.5 jt-secondary-font my-3 sm:mb-0 ">
                {blogData?.title}
              </h3>
              <div className="mt-2">
                by{' '}
                <span className="font-medium">
                  <NameFormatter
                    firstName={blogData?.author?.firstName || ''}
                    lastName={blogData?.author?.lastName || ''}
                  />
                </span>
              </div>
              <div
                className="my-6 text-base font-['Open_Sans'] leading-1.5 "
                dangerouslySetInnerHTML={{
                  __html: blogData?.contents || '',
                }}
              ></div>
            </div>
            <Divider />
            <div className="flex items-start gap-5 flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-2 mt-3">
                {/* <EyeIcon />
                0 views
                <span className="inline-block h-2 w-2 mx-1 rounded-full bg-black opacity-30" /> */}
              </div>
            </div>
            <Divider />
          </Col>
        </Row>
      </MaxWidthWrapper>
    </section>
  );
};

export default BlogDetails;

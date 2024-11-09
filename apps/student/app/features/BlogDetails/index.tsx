import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row } from 'antd';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { fetchBlog, fetchBlogBySlug } from '../../api/blog';
import { renderImage } from 'libs/services/helper';
import DetailBanner from 'apps/student/components/DetailBanner';
import Link from 'next/link';

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

interface IBlogs {
  id: string;
  title: string;
  coverImage: string;
  contents: string;
  slug: string;
}

const BlogDetails = ({ searchParams }: any) => {
  const { blog } = searchParams;
  const [blogData, setBlogData] = useState<IBlog>();
  const [blogs, setBlogs] = useState<IBlogs[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response: any = await fetchBlogBySlug({ blog });
        setBlogData(response.data);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      }
    };

    const fetchAllBlogs = async () => {
      try {
        const response = await fetchBlog();
        setBlogs(response?.data.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
    fetchAllBlogs();
  }, [blog]);

  function Component() {
    return (
      <section className="py-4">
        <h1 className="text-white text-2xl md:text-3xl font-bold lg:w-[37rem]">
          {blogData?.title}
        </h1>
      </section>
    );
  }

  return (
    <section className="mx-auto overflow-hidden bg-white">
      <DetailBanner height="h-[350px]" component={<Component />} />
      <MaxWidthWrapper>
        <section className="py-5">
          <div className="px-5 sm:px-10 md:px-14 lg:px-24 my-3">
            <Breadcrumb separator=">">
              <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue">Blog</Breadcrumb.Item>
              <Breadcrumb.Item className="text-navy-blue">
                {blogData?.title}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </section>

        <div className="px-5 sm:px-10 md:px-14 lg:px-24 my-3">
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={17} lg={17}>
              <div>
                <h3 className="text-dark-blue text-2xl md:text-3xl font-bold mt-2.5 jt-secondary-font my-3 sm:mb-0">
                  {blogData?.title}
                </h3>
                <div className="flex items-start gap-5 mt-3">
                  {blogData?.tags?.map((item, index) => (
                    <h1
                      key={index}
                      className="opacity-80 text-sm font-semibold pl-2 text-[#e7b416]"
                    >
                      #{item}
                    </h1>
                  ))}
                </div>

                <div
                  className="text-base leading-1.5"
                  dangerouslySetInnerHTML={{
                    __html: blogData?.contents || '',
                  }}
                ></div>
              </div>
            </Col>

            <Col xs={7} className="hidden lg:block">
              <div className="flex flex-col gap-4">
                <h1 className="bg-secondary-yellow  text-center h-15 text-2xl font-bold justify-center">
                  More Blogs
                </h1>
                {blogs.slice(0, 5).map((blogItem) => (
                  <div
                    key={blogItem.id}
                    className="mb-6 bg-[#EBF5FF] px-5 py-4 rounded-lg text-base font-Open_Sans flex items-start gap-4"
                  >
                    <div className="bg-[#000] w-[120px] h-[80px] relative overflow-hidden rounded-lg">
                      <div
                        style={{
                          backgroundImage: `url(${renderImage({
                            imgPath: blogItem.coverImage || '',
                            size: 'md',
                          })})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          width: '100%',
                          height: '100%',
                        }}
                      ></div>
                    </div>
                    <div>
                      <Link href={`/blog/${blogItem.slug}`}>
                        <h1 className="text-dark-blue font-bold text-sm justify-center">
                          {blogItem.title}
                        </h1>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default BlogDetails;

import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Empty,
  Pagination,
  Breadcrumb,
  Dropdown,
  Input,
  Button,
  Skeleton,
} from 'antd';
import ProgressiveImageLoading from 'apps/student/components/ProgressiveImage';
import { ChevronDown, X } from 'lucide-react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import ImageLoading from 'apps/student/components/ImageLoading';
import { fetchBlog } from '../../api/blog';
import { renderImage } from 'libs/services/helper';
import Link from 'next/link';
import DetailBanner from 'apps/student/components/DetailBanner';
import CustomSearch from 'apps/student/components/CustomSearch.tsx';

const Blogs = ({ searchParams }: any) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogPosts.slice(indexOfFirstBlog, indexOfLastBlog);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    async function fetchAllBlogs() {
      setLoading(true);
      try {
        const response = await fetchBlog();
        setBlogPosts(response?.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllBlogs();
  }, []);

  function Component() {
    return (
      <section className="py-4">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          All subject areas for Undergraduate courses.
        </h1>
        <h2 className="text-white text-xl mt-4">
          Explore the subject areas below to view related courses and find the
          course that’s right for you.
        </h2>
      </section>
    );
  }

  return (
    <section className="mx-auto overflow-hidden bg-white">
      <DetailBanner height="h-[250px]" component={<Component />} />
      <MaxWidthWrapper>
        <section className={'py-5 '}>
          <div className="px-5 sm:px-10 md:px-14 lg:px-24 my-3 my-3">
            <Breadcrumb separator={'>'}>
              <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue">
                All Blogs
              </Breadcrumb.Item>
            </Breadcrumb>
            <Typography.Text className="text-sm text-navy-blue hover:text-navy-blue">
              Discover various subject areas for higher level studies. Dive into
              the topics below to explore related articles and find insights
              that resonate with you.
            </Typography.Text>
          </div>
        </section>
        <section className="flex justify-center md:justify-start  px-5 sm:px-10 md:px-14 lg:px-24 ">
          <CustomSearch />
        </section>
        <div className=" px-5 sm:px-10 md:px-14 lg:px-24 mt-10 bg-white">
          <section className="py-4">
            {loading ? (
              <Row gutter={[20, 20]} className="py-7 flex">
                <ImageLoading count={2} />
              </Row>
            ) : (
              <Row gutter={[16, 16]}>
                {currentBlogs.map((blog: any) => (
                  <Col key={blog.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                    {' '}
                    {/* Adjusted column size to ensure 3 per row */}
                    <Link href={`/blog/details?blog=${blog.slug}`} passHref>
                      <div className="blog-card bg-white py-4">
                        <div>
                          <ProgressiveImageLoading
                            sizes="(max-width: 400px) 75vw, (max-width: 800px) 65vw, 80vw"
                            imageHeight="h-[300px] lg:min-h-[250px]"
                            openImage
                            srcImage={
                              renderImage({
                                imgPath: blog?.coverImage,
                                size: 'sm',
                              }) || process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE
                            }
                          />
                        </div>
                        <div>
                          <h1 className="text-dark-blue  font-bold font-semibold mt-2 mb-1">
                            {blog.title}
                          </h1>
                        </div>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            )}
          </section>
          <section className="py-4">
            <div className="container mx-auto mb-4 text-center mt-5 flex-end bg-white">
              <Pagination
                current={currentPage}
                total={blogPosts.length}
                pageSize={blogsPerPage}
                className="mx-auto container"
                onChange={handleChangePage}
              />
            </div>
          </section>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default Blogs;

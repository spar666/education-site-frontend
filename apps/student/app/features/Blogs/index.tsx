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

  return (
    <section className="mx-auto">
      <MaxWidthWrapper>
        <section className={'py-5 bg-gray-50'}>
          <div className="container mx-auto my-3">
            <Breadcrumb separator={'>'}>
              <Breadcrumb.Item className="JT_breadcrumb cursor-pointer">
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item className="JT_breadcrumb JT_breadcrumb_last">
                All Blogs
              </Breadcrumb.Item>
            </Breadcrumb>
            <span className="text-sm text-muted-foreground hover:text-gray-600">
              Discover various subject areas for higher level studies. Dive into
              the topics below to explore related articles and find insights
              that resonate with you.
            </span>
          </div>
        </section>
        <div className="container bg-gray-50">
          <section className="py-4">
            {loading ? (
              <Row gutter={[20, 20]} className="py-7 flex">
                <ImageLoading count={2} />
              </Row>
            ) : (
              <Row gutter={[16, 16]}>
                {currentBlogs.map((blog: any) => (
                  <Col key={blog.id} xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Link href={`/blog/details?blog=${blog.slug}`} passHref>
                      <div className="blog-card">
                        <div>
                          <ProgressiveImageLoading
                            sizes="(max-width: 400px) 75vw, (max-width: 800px) 65vw, 80vw"
                            imageHeight="h-[220px] lg:min-h-[200px]"
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
                          <h2 className="font-bold">{blog.title}</h2>
                          {/* <p className="text-xs">By {blog.author}</p>{' '} */}
                          {/* Ensure blog.author is a string */}
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

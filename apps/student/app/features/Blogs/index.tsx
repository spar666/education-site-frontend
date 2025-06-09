import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Empty,
  Pagination,
  Breadcrumb,
  Button,
  Skeleton,
} from 'antd';
import ProgressiveImageLoading from 'apps/student/components/ProgressiveImage';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { fetchBlog } from '../../api/blog';
import { renderImage } from 'libs/services/helper';
import Link from 'next/link';
import DetailBanner from 'apps/student/components/DetailBanner';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  publishedDate?: string;
  excerpt?: string;
}

interface BlogsProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export const metadata = {
  title: 'Study Abroad Blogs & Articles | Study and Visa',
  description:
    'Explore our latest blogs about studying abroad, visa processes, and international education opportunities.',
  alternates: {
    canonical: 'https://www.studyandvisa.com/blog',
  },
  openGraph: {
    title: 'Study Abroad Blogs | Study and Visa',
    description: 'Expert insights for your international education journey',
    url: 'https://www.studyandvisa.com/blog',
    type: 'website',
    images: [
      {
        url: '/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Study and Visa Blogs',
      },
    ],
  },
};

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogPosts.slice(indexOfFirstBlog, indexOfLastBlog);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchAllBlogs() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchBlog();
        if (!response?.data?.data) {
          throw new Error('Invalid response format');
        }
        setBlogPosts(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllBlogs();
  }, []);

  function BannerContent() {
    return (
      <section className="py-4">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          Study Abroad Blogs & Resources
        </h1>
        <p className="text-white text-xl mt-4">
          Discover expert insights and guidance for your international education
          journey.
        </p>
      </section>
    );
  }

  return (
    <>
      {/* Structured Data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.studyandvisa.com/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blogs',
                item: 'https://www.studyandvisa.com/blog',
              },
            ],
          }),
        }}
      />

      {/* Structured Data for Blog Listing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            headline: 'Study Abroad Blog',
            description:
              'Latest articles about studying abroad and visa processes',
            url: 'https://www.studyandvisa.com/blog',
          }),
        }}
      />

      <section className="mx-auto overflow-hidden bg-white">
        <DetailBanner height="h-[250px]" component={<BannerContent />} />
        <MaxWidthWrapper>
          <section className={'py-5'}>
            <div className="px-5 sm:px-10 md:px-14 lg:px-24 my-3">
              <Breadcrumb separator={'>'}>
                <Breadcrumb.Item className="text-dark-blue">
                  <Link href="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className="text-dark-blue">
                  All Blogs
                </Breadcrumb.Item>
              </Breadcrumb>
              <Typography.Text className="text-sm text-navy-blue hover:text-navy-blue">
                Discover various subject areas for higher level studies. Dive
                into the topics below to explore related articles and find
                insights that resonate with you.
              </Typography.Text>
            </div>
          </section>

          <div className="px-5 sm:px-10 md:px-14 lg:px-24 mt-10 bg-white">
            {error ? (
              <div className="text-center py-10">
                <Typography.Text type="danger">{error}</Typography.Text>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  type="primary"
                >
                  Retry
                </Button>
              </div>
            ) : loading ? (
              <Row gutter={[20, 20]} className="py-7 flex">
                {[...Array(6)].map((_, i) => (
                  <Col key={i} xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </Col>
                ))}
              </Row>
            ) : blogPosts.length === 0 ? (
              <Empty description="No blogs found" />
            ) : (
              <>
                <section className="py-4">
                  <Row gutter={[16, 16]}>
                    {currentBlogs.map((blog) => (
                      <Col key={blog.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                        <article
                          itemScope
                          itemType="https://schema.org/BlogPosting"
                        >
                          <Link
                            href={`/blog/details/${blog.slug}`}
                            passHref
                            legacyBehavior
                          >
                            <a
                              className="blog-card bg-white py-4 block hover:shadow-lg transition-shadow duration-300"
                              aria-label={`Read ${blog.title}`}
                              itemProp="url"
                            >
                              <div
                                itemProp="image"
                                itemScope
                                itemType="https://schema.org/ImageObject"
                              >
                                <ProgressiveImageLoading
                                  sizes="(max-width: 400px) 75vw, (max-width: 800px) 65vw, 80vw"
                                  imageHeight="h-[300px] lg:min-h-[250px]"
                                  openImage
                                  srcImage={
                                    renderImage({
                                      imgPath: blog?.coverImage,
                                    }) ||
                                    process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE
                                  }
                                  alt={blog.title || 'Blog cover image'}
                                />
                              </div>
                              <div className="p-4">
                                <h2
                                  className="text-dark-blue font-bold mt-2 mb-1"
                                  itemProp="headline"
                                >
                                  {blog.title}
                                </h2>
                                {blog.publishedDate && (
                                  <meta
                                    itemProp="datePublished"
                                    content={blog.publishedDate}
                                  />
                                )}
                                <meta
                                  itemProp="author"
                                  content="Study and Visa"
                                />
                              </div>
                            </a>
                          </Link>
                        </article>
                      </Col>
                    ))}
                  </Row>
                </section>

                <section className="py-4">
                  <div className="container mx-auto mb-4 text-center mt-5">
                    <Pagination
                      current={currentPage}
                      total={blogPosts.length}
                      pageSize={blogsPerPage}
                      className="mx-auto"
                      onChange={handleChangePage}
                      showSizeChanger={false}
                      itemRender={(current, type, originalElement) => {
                        if (type === 'page') {
                          return (
                            <Link href={`/blog?page=${current}`} scroll={false}>
                              {current}
                            </Link>
                          );
                        }
                        return originalElement;
                      }}
                    />
                  </div>
                </section>
              </>
            )}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
};

export default Blogs;

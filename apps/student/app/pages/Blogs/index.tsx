'use client';
import React, { useEffect, useState } from 'react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Button } from 'libs/ui-components/src/components/ui/button';
import Blog from './SingleBlog';
import Link from 'next/link';
import { fetchBlog } from '../../api/blog';

// Importing images
import USA from '../../../assets/images/usa.jpg';
import Aus from '../../../assets/images/australia.jpg';
import Uk from '../../../assets/images/uk.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from 'react-slick';
// Static data for top 3 blogs
const topBlogs = [
  { title: 'Blog 1', image: USA, description: 'Description of Blog 1' },
  { title: 'Blog 2', image: Aus, description: 'Description of Blog 2' },
  { title: 'Blog 3', image: Uk, description: 'Description of Blog 3' },
];

interface IBlogs {
  id: string;
  title: string;
  coverImage: string;
  contents: string;
  slug: string;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<IBlogs[]>([]);
  const [loading, setLoading] = useState(false);

  const sliderSettings = {
    dots: true,
    slidesToShow: 3,
    arrows: false,
    slidesToScroll: 1,
    speed: 500,
    touchMove: true,
    cssEase: 'linear',

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 715,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  useEffect(() => {
    async function fetchAllBlogs() {
      setLoading(true);
      try {
        const response = await fetchBlog();
        setBlogs(response?.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllBlogs();
  }, []);

  return (
    <section className="my-10 f">
      <MaxWidthWrapper>
        <div className="relative w-full ">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-center text-dark-blue mb-10">
            Explore Further Study Options: Read Our Blogs
          </h2>

          <Slider {...sliderSettings}>
            {/* Rendering top 3 blogs */}
            {blogs.slice(0, 3).map((blog, index) => (
              <div key={index} className=" px-3">
                <Link
                  href={`blog/details/${blog?.slug}`}
                  className="w-full min-w-[350px]"
                >
                  <div>
                    {/* Adding a custom class to adjust image opacity */}
                    <Blog
                      title={blog.title}
                      image={blog.coverImage}
                      className="transparent-image"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </Slider>

          {/* View All Blogs Button */}
          {blogs.length > 0 && (
            <div className="flex justify-center my-5 f">
              <Link href="/blog">
                <Button className="w-full md:w-52 h-12 px-6 py-2 text-primary-blue hover:bg-[#bf9100] bg-secondary-yellow flex justify-center items-center  rounded mt-5  text-base font-bold">
                  View All Blogs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </MaxWidthWrapper>

      {/* Adding custom CSS to adjust image opacity */}
      <style jsx>{`
        .transparent-image img {
          opacity: 0.8; /* Adjust opacity value as needed */
        }
      `}</style>
    </section>
  );
};

export default BlogPage;

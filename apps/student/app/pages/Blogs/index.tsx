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
import Frn from '../../../assets/images/france.jpg';

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
    <section className="m-5 font-['Open_Sans']">
      <MaxWidthWrapper>
        <div className="relative w-full">
          <h2 className="font-bold text-xl md:text-2xl tracking-tight text-center text-dark-blue mb-5">
            Explore Further Study Options: Read Our Blogs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 mt-5 md:mt-10">
            {/* Rendering top 3 blogs */}
            {blogs.slice(0, 3).map((blog, index) => (
              <Link href={`blog/details?blog=${blog?.slug}`}>
                <div key={index} className="w-full">
                  {/* Adding a custom class to adjust image opacity */}
                  <Blog
                    title={blog.title}
                    image={blog.coverImage}
                    className="transparent-image"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* View All Blogs Button */}
          {blogs.length > 0 && (
            <div className="flex justify-center mt-5 font-['Open_Sans']">
              <Link href="/blog">
                <Button className="w-full md:w-52 h-12 px-6 py-2 bg-dark-blue text-white flex justify-center items-center rounded">
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

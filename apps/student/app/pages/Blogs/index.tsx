'use client';
import React, { useEffect, useState } from 'react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Button } from 'libs/ui-components/src/components/ui/button';
import USA from '../../../assets/images/usa.jpg';
import Aus from '../../../assets/images/australia.jpg';
import Uk from '../../../assets/images/uk.jpg';
import Frn from '../../../assets/images/france.jpg';
import Blog from './SingleBlog';
import Link from 'next/link';
import { fetchBlog } from '../../api/blog';

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
    <section className="border-t border-gray-200">
      <MaxWidthWrapper className="py-20 relative">
        <div className="relative w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold tracking-tight text-gray-900">
              Our Blogs
            </h2>
            <Link href="/blog">See More</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogs.splice(0, 3).map((blog, index) => (
              <div key={index} className="w-full">
                <Blog
                  title={blog.title}
                  image={topBlogs[0].image}
                  description={blog.contents}
                />
              </div>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default BlogPage;

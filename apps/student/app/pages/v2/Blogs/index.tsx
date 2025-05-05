'use client';

import { fetchBlog } from 'apps/student/app/api/blog';
import { renderImage } from 'libs/services/helper';
import { ArrowRight, Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Skeleton Loader Component
const BlogSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-60 w-full bg-gray-200" />
      <div className="p-6">
        <div className="flex items-center mb-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full mr-2" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="flex items-center">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded-full ml-2" />
        </div>
      </div>
    </div>
  );
};

interface IBlogs {
  id: string;
  title: string;
  coverImage: string;
  contents: string;
  createdAt: string;
  slug: string;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';

  return `${day}${suffix} ${month} ${year}`;
}

function BlogSection() {
  const [blogs, setBlogs] = useState<IBlogs[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAllBlogs() {
      setLoading(true);
      try {
        const response = await fetchBlog();
        setBlogs(response?.data?.data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllBlogs();
  }, []);

  return (
    <section id="blogs" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-8">Latest Blog</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <BlogSkeleton key={index} />
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="h-60 w-full relative">
                    <Image
                      src={renderImage({
                        imgPath: post.coverImage,
                      })}
                      layout="fill"
                      objectFit="cover"
                      alt={post.title}
                      className="rounded-t-xl"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(post.createdAt)}
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                      {post.title}
                    </h3>
                    <a
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 font-medium flex items-center"
                    >
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-3">
                No blogs available.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default BlogSection;

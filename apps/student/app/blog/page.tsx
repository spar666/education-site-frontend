'use client';
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, ArrowRight, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlog } from 'apps/student/app/api/blog';
import { renderImage } from 'libs/services/helper';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  category?: string;
  createdAt?: string;
  readTime?: string;
  contents?: string;
}

function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching blogs from API...');
        const response = await fetchBlog();
        console.log('Blogs API response:', response);
        const blogsData = response?.data?.data || [];
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Keep empty array on error
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'visa-updates', label: 'Visa Updates' },
    { value: 'student-life', label: 'Student Life' },
    { value: 'scholarships', label: 'Scholarships' },
    { value: 'career-tips', label: 'Career Tips' },
    { value: 'university-news', label: 'University News' },
  ];

  // Filter blogs from API
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'all' || 
      blog.category?.toLowerCase().replace(/ /g, '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured and recent blogs
  const featuredBlogs = filteredBlogs.slice(0, 3);
  const recentBlogs = filteredBlogs.slice(3);

  // Calculate read time based on content length
  const calculateReadTime = (content?: string) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Blog</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8">
              Latest updates on Australian student visas, scholarships, university news, and student life
            </p>
          </div>

          {/* Search & Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredBlogs.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => {
                const imageSrc = blog.coverImage 
                  ? renderImage({ imgPath: blog.coverImage })
                  : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800';
                
                return (
                  <Link key={blog._id} href={`/blog/details/${blog.slug}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                        {blog.category && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {blog.description || 'Read more about this topic...'}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {blog.createdAt 
                                ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Recent'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{calculateReadTime(blog.contents)}</span>
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {featuredBlogs.length > 0 ? 'More Articles' : 'All Articles'}
            </h2>
            <p className="text-gray-600">
              {loading ? 'Loading articles...' : `${filteredBlogs.length} articles available`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-56 rounded-2xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(recentBlogs.length > 0 ? recentBlogs : filteredBlogs).map((blog) => {
                const imageSrc = blog.coverImage 
                  ? renderImage({ imgPath: blog.coverImage })
                  : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800';
                
                return (
                  <Link key={blog._id} href={`/blog/details/${blog.slug}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {blog.category && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-semibold">
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {blog.description || 'Read more about this topic...'}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {blog.createdAt 
                                ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : 'Recent'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{calculateReadTime(blog.contents)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600">Find articles that match your interests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(1).map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg'
                }`}
              >
                <Tag className="w-5 h-5 mx-auto mb-2" />
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to get the latest updates on visa changes, scholarships, and study tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 outline-none"
            />
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogsPage;

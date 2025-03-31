'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchCourseCategories } from 'apps/student/app/api/courses';
import { renderImage } from 'libs/services/helper';
import Image from 'next/image';
import Link from 'next/link';

interface ICourseCategory {
  id: string;
  name: string;
  icon: string;
  totalCourses: number;
}

const CategorySkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse h-32 flex items-center gap-6">
    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const CategoryCard: React.FC<{ category: ICourseCategory }> = ({
  category,
}) => (
  <div className="flex justify-center">
    <div className="bg-white p-6 rounded-2xl items-center shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100 group flex items-center gap-6 h-25">
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={renderImage({ imgPath: category.icon || '', size: 'lg' })}
          alt={`${category.name} category icon`}
          fill
          sizes="64px"
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {category.totalCourses}{' '}
          {category.totalCourses === 1 ? 'Course' : 'Courses'}
        </p>
        <Link
          href={`/courses/${category.id}`}
          className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-800 transition-all duration-200 group-hover:gap-3 w-fit"
        >
          Explore Now
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  </div>
);

const CourseCategories: React.FC = () => {
  const [categories, setCategories] = useState<ICourseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchCourseCategories();
        setCategories(response || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-7 md:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Course Categories
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover your perfect learning path with our curated course
            selection
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-start max-w-7xl">
            {loading
              ? Array(4)
                  .fill(null)
                  .map((_, index) => <CategorySkeleton key={index} />)
              : categories
                  .slice(0, 4)
                  .map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;

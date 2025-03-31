'use client';
import { useEffect, useState } from 'react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { ChevronRight, MoveLeftIcon, MoveRightIcon } from 'lucide-react';
import { fetchCategoriesWithCourses } from '../../api/courses';
import Link from 'next/link';
import Logo from '../../../assets/Logo/Logo.png';
import Image from 'next/image';
import { renderImage } from 'libs/services/helper';

interface ICourse {
  id: string;
  courseName: string;
  slug: string;
}

interface ICourseCategory {
  id: string;
  courseCategory: string;
  icon: any; // URL or SVG for the icon
  courses: ICourse[];
}

export const FeaturedCourse = () => {
  const [categories, setCategories] = useState<ICourseCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await fetchCategoriesWithCourses(); // Fetch categories with icons
        setCategories(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <section className="py-16 px-4">
      <MaxWidthWrapper className="pb-5 lg:pb-10">
        <div className="flex justify-center flex-col  ">
          <h2 className="text-xl sm:text-3xl font-bold italic tracking-tight text-dark-blue mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-500 mt-2">
            Discover your perfect learning path with our carefully curated
            course categories
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : (
          <div className="mt-5 lg:mt-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {categories.slice(0, 4).map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 border border-indigo-50"
              >
                {/* Image Section */}
                <div className="p-4">
                  <Image
                    src={`${renderImage({
                      imgPath: category?.icon || '',
                      size: 'lg',
                    })}`}
                    height={30}
                    width={30}
                    alt="Icon"
                    className="block"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-xl font-bold text-black mb-3">
                  {category.courseCategory}{' '}
                </h3>
                <button className="group flex items-center text-black font-semibold hover:text-indigo-800 transition-colors duration-200">
                  Explore Courses
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </MaxWidthWrapper>
    </section>
  );
};

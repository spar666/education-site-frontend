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
    <section className="my-5 ">
      <MaxWidthWrapper className="pb-5 lg:pb-10">
        <div className="flex justify-center flex-col  ">
          <h2 className="text-xl sm:text-3xl font-bold italic tracking-tight text-dark-blue mb-4">
            Categories
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : (
          <div className="mt-5 lg:mt-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {categories.slice(0, 4).map((category) => (
              <div
                key={category.id}
                className="flex flex-col border border-shadow shadow-lg rounded-lg overflow-hidden  "
              >
                {/* Image Section */}
                <div className="p-4">
                  <Image
                    src={`${renderImage({
                      imgPath: category?.icon || '',
                      size: 'sm',
                    })}`}
                    height={30}
                    width={30}
                    alt="Icon"
                    className="block"
                  />
                </div>
                {/* Text Section */}
                <h3 className="text-xl font-bold text-black mb-4 text-left pl-4">
                  {category.courseCategory || 'Unknown Category'}{' '}
                  {/* Fallback for missing category */}
                </h3>
                <span className="text-base text-gray-700 mb-4 text-left pl-4">
                  Enroll today and take the first step toward your dream career!
                </span>
                <button className="flex text-sm  text-navy-blue w-40 h-10  mb-4 mx-2 text-left pl-4 gap-2 ">
                  <MoveRightIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </MaxWidthWrapper>
    </section>
  );
};

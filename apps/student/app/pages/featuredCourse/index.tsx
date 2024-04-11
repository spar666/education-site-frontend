'use client';
import { useEffect, useState } from 'react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { ArrowDownToLine, CheckCircle, ChevronRight, Leaf } from 'lucide-react';
import { fetchCourses } from '../../api/courses';
import Link from 'next/link';

interface IPopularCourse {
  id: string;
  courseName: string;
  slug: string;
  subject: { id: string; subjectName: string }[];
}

export const FeaturedCourse = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [courses, setCourses] = useState<IPopularCourse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTopCourses() {
      setLoading(true);
      try {
        const response = await fetchCourses();
        console.log(response, 'from api');
        setCourses(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopCourses();
  }, []);

  const handleSlideChange = ({ direction }: any) => {};

  return (
    <section className="m-5 font-[quicksand]">
      <MaxWidthWrapper className="py-5 lg:py-10">
        <div className="flex justify-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center text-dark-blue">
            What to Study? Checkout some of popular courses
          </h2>
        </div>
        <div className="mt-5 lg:mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course?.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {course?.courseName}
                </h3>
                <hr className="w-full border-t border-blue-500 mb-4 mx-auto" />

                <ul className="text-sm text-muted-foreground">
                  {course.subject.length > 0 ? (
                    course.subject.slice(0, 3).map((sub, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <a className="flex items-center gap-2">
                          <ChevronRight size={16} />
                          {sub.subjectName}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No Subjects Found</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {courses.length > 0 && (
          <div className="flex justify-center">
            <Link href={`/course/details?course=${courses[0]?.slug}`}>
              <button
                type="button"
                className="w-full lg:w-auto h-10 px-4 py-2 bg-dark-blue text-white flex justify-center items-center rounded mt-5"
              >
                View All Courses
              </button>
            </Link>
          </div>
        )}
      </MaxWidthWrapper>
    </section>
  );
};

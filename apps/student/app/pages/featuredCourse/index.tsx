'use client';
import CarouselControls from 'apps/student/components/CarouselControls';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import {
  ArrowDownToLine,
  CheckCircle,
  ChevronRight,
  Leaf,
  Link,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchCourses } from '../../api/courses';

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
    <section className="border-t border-gray-200 bg-gray-50">
      <MaxWidthWrapper className="py-20">
        <div className="flex justify-between">
          <span className="font-bold tracking-tight text-gray-900">
            Popular Courses
          </span>
          <CarouselControls
            direction="horizontal"
            onSlideChange={handleSlideChange}
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
          {courses.slice(0, 3).map((course) => (
            <div key={course?.id} className="flex items-center gap-x-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900"></div>
              <div className="flex flex-col">
                <h3 className="text-base font-medium text-gray-900">
                  {course?.courseName}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {course.subject.slice(0, 3).map((sub, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <ChevronRight size={16} />
                      {sub.subjectName}
                    </li>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Define the Course interface
interface Course {
  id: string;
  courseName: string;
  slug: string;
}

interface CoursesGridProps {
  courses: Course[];
  onClose: () => void;
}

export const CoursesGrid: React.FC<CoursesGridProps> = ({
  courses,
  onClose,
}) => {
  // Take only the top 5 courses
  const topCourses = courses?.slice(0, 5) || [];

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-900 pb-2 flex items-center">
        <span className="flex-1">Courses</span>
      </h2>

      {/* List */}
      <div className="grid gap-2">
        {topCourses.length > 0 ? (
          topCourses.map((course) => (
            <Link
              key={course.id}
              href={`/subject/${course.slug}`}
              onClick={onClose}
              className="group flex items-center justify-between p-3 rounded-lg  hover:bg-blue-50 transition-all duration-200 "
            >
              <div className="flex items-center flex-1">
                <span className="text-base font-medium text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                  {course.courseName}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No courses available.
          </p>
        )}
      </div>
    </div>
  );
};

'use client';

import Link from 'next/link';

interface Course {
  id: string;
  courseName: string;
  slug: string;
}

interface CoursesGridProps {
  courses: Course[];
  onClose: () => void;
}

export const CoursesGrid = ({ courses, onClose }: CoursesGridProps) => (
  <div>
    <span className="block font-bold text-gray-900 pb-2">Courses</span>
    <div className="flex flex-wrap items-start gap-6 mt-2">
      {courses &&
        Array(Math.ceil(courses.length / 4))
          .fill(4)
          .map((_, groupIndex) => (
            <div key={groupIndex} className="w-full sm:w-1/4">
              {courses
                .slice(groupIndex * 4, groupIndex * 4 + 4)
                .map((course, index) => (
                  <div
                    onClick={onClose}
                    key={course.slug}
                    className={`group relative sm:text-sm ${
                      index > 0 ? 'mt-2' : ''
                    }`}
                  >
                    <Link
                      href={`/subject/${course.slug}`}
                      className="text-base text-gray-800 hover:text-blue-500"
                      style={{ width: 'max-content' }}
                    >
                      {course.courseName}
                    </Link>
                  </div>
                ))}
            </div>
          ))}
    </div>
  </div>
);

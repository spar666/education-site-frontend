'use client';
import CourseDetails from 'apps/student/app/features/Courses/Details';
import { useParams } from 'next/navigation';

export default function CoursePage() {
  const params = useParams();
  const { course, university } = params;
  const searchParams = { 
    course: Array.isArray(course) ? course[0] : course, 
    university: Array.isArray(university) ? university[0] : university 
  };

  return <CourseDetails searchParams={searchParams} />;
}

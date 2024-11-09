'use client';
import CourseDetails from 'apps/student/app/features/Courses/Details';
import { useParams } from 'next/navigation';

export default function CoursePage() {
  const params = useParams();
  const { course, university } = params;
  const searchParams = { course, university };

  return <CourseDetails searchParams={searchParams} />;
}

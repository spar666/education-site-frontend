'use client';
import { useParams } from 'next/navigation';
import Course from '../../../features/Courses';

export default function CoursePage() {
  const params = useParams();
  const { degree } = params;
  const searchParams = { degree };
  return <Course searchParams={searchParams} />;
}

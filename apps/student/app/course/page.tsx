'use client';
import { useRouter } from 'next/router';
import Course from '../features/Courses';

export default function CoursePage({
  searchParams,
}: {
  searchParams: { degree: string };
}) {
  return <Course searchParams={searchParams} />;
}

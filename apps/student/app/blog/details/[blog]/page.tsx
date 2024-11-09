'use client';

import BlogDetails from '../../../features/BlogDetails';
import { useParams } from 'next/navigation';

export default function blog() {
  const params = useParams();
  const { blog } = params;
  const searchParams = { blog };
  return <BlogDetails searchParams={searchParams} />;
}

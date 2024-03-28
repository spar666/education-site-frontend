'use client';

import BlogDetails from '../../features/BlogDetails';

export default function blog({
  searchParams,
}: {
  searchParams: { blog: string };
}) {
  return <BlogDetails searchParams={searchParams} />;
}

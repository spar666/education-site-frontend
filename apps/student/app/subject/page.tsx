'use client';

import Subject from '../features/Subjects';

export default function subject({
  searchParams,
}: {
  searchParams: { subjectName: string };
}) {
  return <Subject searchParams={searchParams} />;
}

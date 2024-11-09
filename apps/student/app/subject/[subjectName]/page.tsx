'use client';

import Subject from '../../features/Subjects';
import { useParams } from 'next/navigation';
export default function subject() {
  const params = useParams();
  const { subjectName } = params;
  const searchParams = { subjectName };
  return <Subject searchParams={searchParams} />;
}

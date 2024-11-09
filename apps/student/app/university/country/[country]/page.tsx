'use client';
import University from '../../../features/Universities';
import { useParams } from 'next/navigation';

export default function university() {
  const params = useParams();
  const { country } = params;
  const searchParams = { country };
  return (
    <>
      <University searchParams={searchParams} />
    </>
  );
}

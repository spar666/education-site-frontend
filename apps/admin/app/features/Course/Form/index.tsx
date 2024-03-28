'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import CourseForm from './components/course';
import AdminLayout from 'apps/admin/components/SCLayout_v2';

function CreateCourse({ searchParams }: any) {
  const { id } = searchParams || {};

  return (
    <AdminLayout title={id ? 'Edit Course' : 'Create Course'}>
      <CourseForm children={undefined} />
    </AdminLayout>
  );
}

export default CreateCourse;

'use client';
import React from 'react';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import CourseCategoryForm from './Form';

function UpdateCourseCategory({ searchParams }: any) {
  const { id } = searchParams || {};

  return (
    <AdminLayout title={id ? 'Edit Course' : 'Create Course'}>
      <CourseCategoryForm  />
    </AdminLayout>
  );
}

export default UpdateCourseCategory;

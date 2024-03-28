'use client';

import React from 'react';

import AdminLayout from 'apps/admin/components/SCLayout_v2';
import BlogForm from './components/blogs';

function CreateBlogs({ searchParams }: any) {
  const { id } = searchParams || {};
  return (
    <AdminLayout title={id ? 'Edit Blog' : 'Create Blog'}>
      <BlogForm />
    </AdminLayout>
  );
}

export default CreateBlogs;

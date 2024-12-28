'use client';

import React from 'react';

import AdminLayout from 'apps/admin/components/SCLayout_v2';
import BannerForm from './components/banner';

function CreateBannerForm({ searchParams }: any) {
  const { id } = searchParams || {};
  return (
    <AdminLayout title={id ? 'Edit Banner' : 'Create Banner'}>
      <BannerForm />
    </AdminLayout>
  );
}

export default CreateBannerForm;

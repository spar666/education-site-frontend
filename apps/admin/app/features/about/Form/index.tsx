'use client';

import React from 'react';

import AdminLayout from 'apps/admin/components/SCLayout_v2';
import AboutForm from './components/about';

function CreateAboutForm({ searchParams }: any) {
  const { id } = searchParams || {};
  return (
    <AdminLayout title={id ? 'Edit Faq' : 'Create About'}>
      <AboutForm />
    </AdminLayout>
  );
}

export default CreateAboutForm;

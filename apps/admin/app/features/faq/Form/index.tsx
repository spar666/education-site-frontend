'use client';

import React from 'react';

import AdminLayout from 'apps/admin/components/SCLayout_v2';
import FAQForm from './components/faq';

function CreateFAQ({ searchParams }: any) {
  const { id } = searchParams || {};
  return (
    <AdminLayout title={id ? 'Edit Faq' : 'Create Faq'}>
      <FAQForm />
    </AdminLayout>
  );
}

export default CreateFAQ;

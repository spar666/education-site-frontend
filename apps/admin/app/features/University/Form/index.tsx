'use client';
import React from 'react';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import UniversityForm from './components/university';

function CreateUniversity({ searchParams }: any) {
  const { id } = searchParams || {};

  return (
    <AdminLayout title={id ? 'Edit University' : 'Create University'}>
      <UniversityForm />
    </AdminLayout>
  );
}

export default CreateUniversity;

'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import AddUserForm from './components/user';

function CreateUser({ searchParams }: any) {
  const { id } = searchParams || {};

  return (
    <AdminLayout title={id ? 'Edit User' : 'Create User'}>
      <AddUserForm />
    </AdminLayout>
  );
}

export default CreateUser;

'use client';
import React from 'react';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import DestinationForm from './Form';

function UpdateDestination({ searchParams }: any) {
  const { id } = searchParams || {};

  return (
    <AdminLayout title={id ? 'Edit Destination' : 'Create Destination'}>
      <DestinationForm />
    </AdminLayout>
  );
}

export default UpdateDestination;

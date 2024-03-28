import CreateBlogs from 'apps/admin/app/features/Blogs/Form';
import React from 'react';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <CreateBlogs searchParams={searchParams} />;
}

export default Edit;

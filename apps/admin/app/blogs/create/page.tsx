import React from 'react';
import CreateBlogs from '../../features/Blogs/Form';

// Force dynamic rendering to avoid useSearchParams Suspense issues
export const dynamic = 'force-dynamic';

function Create() {
  return <CreateBlogs />;
}

export default Create;

import React from 'react';
import CreateCourse from '../../features/Course/Form';

// Force dynamic rendering to avoid useSearchParams Suspense issues
export const dynamic = 'force-dynamic';

function Create() {
  return <CreateCourse />;
}

export default Create;

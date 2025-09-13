import React from 'react';
import CreateUniversity from '../../features/University/Form';

// Force dynamic rendering to avoid useSearchParams Suspense issues
export const dynamic = 'force-dynamic';

function Create() {
  return <CreateUniversity />;
}

export default Create;

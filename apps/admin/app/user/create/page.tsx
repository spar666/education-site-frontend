import React from 'react';
import CreateUser from '../../features/user/Form';

// Force dynamic rendering to avoid useSearchParams Suspense issues
export const dynamic = 'force-dynamic';

function Create() {
  return <CreateUser />;
}

export default Create;

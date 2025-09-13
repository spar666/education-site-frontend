import React from 'react';
import CreateAboutForm from '../../features/about/Form';

// Force dynamic rendering to avoid useSearchParams Suspense issues
export const dynamic = 'force-dynamic';

function Create() {
  return <CreateAboutForm />;
}

export default Create;

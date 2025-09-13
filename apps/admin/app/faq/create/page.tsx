import React from 'react';
import CreateFAQ from '../../features/faq/Form';

// Force dynamic rendering to avoid useSearchParams Suspense issues
export const dynamic = 'force-dynamic';

function Create() {
  return <CreateFAQ />;
}

export default Create;

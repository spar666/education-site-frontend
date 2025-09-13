import React from 'react';
import CreateBannerForm from '../../features/banner/Form';

// Force dynamic rendering to avoid useSearchParams Suspense issues
export const dynamic = 'force-dynamic';

function Create() {
  return <CreateBannerForm />;
}

export default Create;

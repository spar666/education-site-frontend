import React from 'react';
import CreateBannerForm from '../../features/banner/Form';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <CreateBannerForm searchParams={searchParams} />;
}

export default Edit;

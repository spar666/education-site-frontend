import React from 'react';
import CreateAboutForm from '../../features/about/Form';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <CreateAboutForm searchParams={searchParams} />;
}

export default Edit;

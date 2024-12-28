import React from 'react';
import CreateFAQ from '../../features/faq/Form';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <CreateFAQ searchParams={searchParams} />;
}

export default Edit;

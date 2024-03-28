import React from 'react';
import CreateUniversity from '../../features/University/Form';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <CreateUniversity searchParams={searchParams} />;
}

export default Edit;

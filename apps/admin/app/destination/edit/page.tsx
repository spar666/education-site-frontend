import React from 'react';
import UpdateDestination from '../../features/Destination';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <UpdateDestination searchParams={searchParams} />;
}

export default Edit;

import React from 'react';
import CreateUser from '../../features/user/Form';


function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <CreateUser searchParams={searchParams} />;
}

export default Edit;

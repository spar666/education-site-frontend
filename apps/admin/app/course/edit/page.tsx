import React from 'react';
import CreateCourse from '../../features/Course/Form';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <CreateCourse searchParams={searchParams} />;
}

export default Edit;

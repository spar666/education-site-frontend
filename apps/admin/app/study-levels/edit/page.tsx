import React from 'react';
import UpdateStudyLevel from '../../features/StudyLevels';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <UpdateStudyLevel searchParams={searchParams} />;
}

export default Edit;

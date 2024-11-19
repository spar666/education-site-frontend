import React from 'react';
import UpdateCourseCategory from '../../features/CourseCategory';

function Edit({ searchParams }: { searchParams: { id: string } }) {
  return <UpdateCourseCategory searchParams={searchParams} />;
}

export default Edit;

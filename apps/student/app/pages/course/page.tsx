import React from 'react';
import Courses from '../../features/Courses';

const Course = ({ searchParams }: any) => {
  return (
    <>
      <Courses searchParams={searchParams} />
    </>
  );
};

export default Course;

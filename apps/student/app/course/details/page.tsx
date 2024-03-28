import CourseDetails from '../../features/Courses/Details';

export default function details({
  searchParams,
}: {
  searchParams: { course: string };
}) {
  return (
    <>
      <CourseDetails searchParams={searchParams} />
    </>
  );
}

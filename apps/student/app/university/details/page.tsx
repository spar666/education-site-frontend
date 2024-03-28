import UniversityDetails from 'apps/student/app/features/Universities/Details';

export default function details({
  searchParams,
}: {
  searchParams: { uni: string };
}) {
  return (
    <>
      <UniversityDetails searchParams={searchParams} />
    </>
  );
}

import Search from '../features/Search';

export default function study({
  searchParams,
}: {
  searchParams: { level: string; course: string; location: string };
}) {
  return (
    <>
      <Search searchParams={searchParams} />
    </>
  );
}

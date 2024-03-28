import University from '../features/Universities';

export default function university({
  searchParams,
}: {
  searchParams: { country: string };
}) {
  return (
    <>
      <University searchParams={searchParams} />
    </>
  );
}

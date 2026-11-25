import { redirect } from 'next/navigation';

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );

  redirect(`/en/book${query.size ? `?${query.toString()}` : ''}`);
}

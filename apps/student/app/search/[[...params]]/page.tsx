'use client';
import Search from '../../features/Search';
import { redirect } from 'next/navigation';

type SearchParamKey = 'destination' | 'course' | 'qualification' | 'location';
type SearchParams = Partial<Record<SearchParamKey, string>>;

interface SearchPageProps {
  params: { params?: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const validKeys: SearchParamKey[] = ['destination', 'course', 'qualification', 'location'];

export default function SearchPage({
  params,
  searchParams = {},
}: SearchPageProps) {
  const parsedParams: SearchParams = {};

  console.log('=== Search Page ===');
  console.log('URL params:', params);
  console.log('URL searchParams:', searchParams);

  // Parse from query parameters
  for (const key of validKeys) {
    const value = searchParams[key];
    if (typeof value === 'string' && value.trim()) {
      parsedParams[key] = decodeURIComponent(value.trim());
    }
  }

  // Parse from route segments
  if (Array.isArray(params.params)) {
    for (const segment of params.params) {
      const [key, value] = decodeURIComponent(segment).split('=');
      if (validKeys.includes(key as SearchParamKey) && value?.trim()) {
        parsedParams[key as SearchParamKey] = value.trim();
      }
    }
  }

  console.log('Parsed params being sent to Search component:', parsedParams);

  // Only redirect if this is NOT the base /search route
  const isBaseSearch = !params.params || params.params.length === 0;
  if (!Object.values(parsedParams).some(Boolean) && !isBaseSearch) {
    redirect('/search');
  }

  return <Search searchParams={parsedParams} />;
}

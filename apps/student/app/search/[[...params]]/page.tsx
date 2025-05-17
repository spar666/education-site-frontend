import Search from '../../features/Search';
import { redirect } from 'next/navigation';

type SearchParams = {
  destination: string | null;
  course: string | null;
  qualification: string | null;
};

interface SearchPageProps {
  params: {
    params?: string[];
  };
}

export default function SearchPage({ params }: SearchPageProps) {
  // Initialize with proper types and default values
  const searchParams: any = {
    destination: null,
    course: null,
    qualification: null,
  };

  try {
    // Parse route segments
    if (params.params) {
      for (const encodedSegment of params.params) {
        // First decode the entire segment
        const decodedSegment = decodeURIComponent(encodedSegment);

        // Then split on the equals sign
        if (!decodedSegment.includes('=')) {
          console.warn(`Invalid route segment format: ${decodedSegment}`);
          continue;
        }

        const [key, value] = decodedSegment.split('=');

        switch (key) {
          case 'destination':
            searchParams.destination = value || null;
            break;
          case 'course':
            searchParams.course = value || null;
            break;
          case 'qualification':
            searchParams.qualification = value || null;
            break;
          default:
            console.warn(`Unknown route parameter: ${key}`);
        }
      }
    }

    // If no valid parameters found, redirect to clean search page
    if (
      !searchParams.destination &&
      !searchParams.course &&
      !searchParams.qualification
    ) {
      redirect('/search');
    }
  } catch (error) {
    console.error('Error parsing search parameters:', error);
    redirect('/search'); // Fallback to default search page on error
  }

  return <Search searchParams={searchParams} />;
}

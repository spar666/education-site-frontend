import { fetchAllPopularDestination } from 'apps/student/app/api/studyDestination';
import { renderImage } from 'libs/services/helper';
import { Globe2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Destination {
  destination_id: string;
  destination_name: string;
  destination_slug: string;
  destination_image: string;
  destination_createdAt: string | null;
  totaluniversities: string;
  totalcourses: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    status: string;
    message: string;
    data: Destination[];
  };
}

const DestinationSkeleton: React.FC = () => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg animate-pulse">
      <div className="aspect-[16/10] bg-gray-200" />
      <div className="p-6">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-4" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-1" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-9 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetchAllPopularDestination();
        console.log(response, 'response');
        const destinationData = response.data || [];
        setDestinations(destinationData);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-blue-900 mb-8">
        Popular Study Destinations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading
          ? Array(3)
              .fill(null)
              .map((_, index) => <DestinationSkeleton key={index} />)
          : destinations.slice(0, 3).map((destination) => (
              <div
                key={destination.destination_id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={`${renderImage({
                      imgPath: destination?.destination_image || '',
                    })}`}
                    alt={destination.destination_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {destination.destination_name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {destination.destination_name === 'Australia'
                      ? 'World-class education in a multicultural environment'
                      : destination.destination_name === 'Canada'
                      ? 'Quality education with post-study work opportunities'
                      : destination.destination_name === 'New Zealand'
                      ? 'Excellence in education amidst natural beauty'
                      : 'Explore top-tier education opportunities'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Globe2 className="h-4 w-4 mr-1" />
                      <span>{destination.totaluniversities} Universities</span>
                    </div>
                    <div>
                      <span>{destination.totalcourses}+ Courses</span>
                    </div>
                  </div>
                  <a
                    href={`#${destination.destination_slug}`}
                    className="inline-block w-full text-center bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
                  >
                    Explore Universities
                  </a>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Index;

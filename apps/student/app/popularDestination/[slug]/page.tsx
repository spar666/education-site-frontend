'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface University {
  id: string;
  isActive: boolean;
  worldRanking: number;
  universityName: string;
  slug: string;
  location?: string;
}

interface DestinationData {
  destination_name: string;
  destination_description: string;
  universitycount: number;
  coursecount: number;
  destination_slug: string;
  universities: University[];
  destination_totalAverageCost: number;
  destination_totalLivingCost: number;
  destination_requirements: string[];
}

const DetailSection = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`mb-8 ${className}`}>
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-blue-100">
      {title}
    </h2>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {children}
    </div>
  </section>
);

const UniversityRow = ({
  rank,
  name,
  courses,
  slug,
  location,
}: {
  rank: number;
  name: string;
  courses: string;
  slug: string;
  location?: string;
}) => {
  const router = useRouter();

  const handleViewClick = () => {
    router.push(`/university/details?uni=${slug}`);
  };

  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
          {rank}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        <div className="font-semibold">{name}</div>
        {location && (
          <div className="text-xs text-gray-500 mt-1 flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {location}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {courses}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={handleViewClick}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View →
        </button>
      </td>
    </tr>
  );
};

const StatsCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-100">
    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-2xl font-bold text-gray-800">
      {typeof value === 'number' && !isNaN(value)
        ? value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })
        : value}
    </p>
  </div>
);

const ListItem = ({
  children,
  iconColor = 'blue',
}: {
  children: React.ReactNode;
  iconColor?: 'blue' | 'gray' | 'green';
}) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-50',
    gray: 'text-gray-500 bg-gray-50',
    green: 'text-green-500 bg-green-50',
  };

  return (
    <li className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
      <span
        className={`w-6 h-6 rounded-full ${colorClasses[iconColor]} flex items-center justify-center mr-3`}
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
      <span className="text-gray-700">{children}</span>
    </li>
  );
};

export default function DestinationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [destinationData, setDestinationData] =
    useState<DestinationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    const level =
      document.querySelector<HTMLSelectElement>('select[name="level"]')
        ?.value || '';
    const course =
      document.querySelector<HTMLSelectElement>('select[name="course"]')
        ?.value || '';

    router.push(`/search?level=${level}&course=${course}&location=${slug}`);
  };

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/destination/popularDestination/${slug}`
        );
        const destinationData = response.data.data.data;
        if (!destinationData)
          throw new Error('Invalid data structure received from API');
        setDestinationData(destinationData);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err instanceof Error
            ? err.message
            : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
          <h3 className="text-lg font-bold text-red-600 mb-2">Loading Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!destinationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No destination data available</p>
      </div>
    );
  }

  const topUniversities =
    destinationData.universities
      ?.filter((u) => u.isActive)
      ?.sort((a, b) => a.worldRanking - b.worldRanking)
      ?.slice(0, 4) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Destinations
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Study in {destinationData.destination_name}
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Discover world-class education opportunities in{' '}
            {destinationData.destination_name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DetailSection title="About Studying Here">
              <div className="prose max-w-none text-gray-700">
                <div
                  dangerouslySetInnerHTML={{
                    __html: destinationData.destination_description || '',
                  }}
                />
              </div>
            </DetailSection>

            <DetailSection
              title={`Top Universities (${topUniversities.length})`}
            >
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        University
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Programs
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topUniversities.map((univ) => (
                      <UniversityRow
                        key={univ.id}
                        rank={univ.worldRanking}
                        name={univ.universityName}
                        courses="350+"
                        slug={univ.slug}
                        location={univ.location}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </DetailSection>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Key Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <StatsCard
                  label="Universities"
                  value={destinationData.universitycount}
                />
                <StatsCard
                  label="Programs"
                  value={destinationData.coursecount}
                />
                <StatsCard
                  label="Avg. Tuition"
                  value={destinationData.destination_totalAverageCost}
                />
                <StatsCard
                  label="Living Costs"
                  value={destinationData.destination_totalLivingCost}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Study Requirements
              </h3>
              <ul className="space-y-2">
                {destinationData.destination_requirements?.map((req, i) => (
                  <ListItem key={i}>{req}</ListItem>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">
                Need Help Applying?
              </h3>
              <p className="text-blue-100 mb-5">
                Our experts can guide you through the entire process to study in{' '}
                {destinationData.destination_name}.
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="w-full bg-white text-blue-700 hover:bg-blue-50 py-2 rounded-lg font-medium transition-colors"
              >
                Free Consultation
              </button>
            </div>
          </div>
        </div>

        <DetailSection title="Ready to Apply?" className="mt-12">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse All Universities
            </button>
            {/* <button
              onClick={() => router.push('/compare')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors font-medium"
            >
              Compare Programs
            </button> */}
          </div>
        </DetailSection>
      </div>
    </div>
  );
}

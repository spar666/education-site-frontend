'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCookie } from 'cookies-next';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import Image from 'next/image';
import { ArrowBigRight } from 'lucide-react';
import { Skeleton } from 'antd';
import useUser from 'apps/student/hook/useUser';
import AuthService from '../../api/auth';
import { renderImage } from 'libs/services/helper';
import { useRouter } from 'next/navigation';

// Type definitions
type Course = {
  id: string;
  courseName: string;
  slug: string;
};

type CourseSubject = {
  id: string;
  course: Course;
};

type Destination = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

type University = {
  id: string;
  name: string;
  slug: string;
  worldRanking: number;
  universityImage: string | null;
  description: string;
  courseSubject?: CourseSubject[]; // optional for safety
  destination: Destination;
};

const Recommendation = () => {
  const router = useRouter();
  const [preferences, setPreferences] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const { isAuthenticated } = useUser();

  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await AuthService.getPreferences(token);
      const data = response.data?.data;
      console.log('Fetched Preferences:', data);

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      setPreferences(data);
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError('Failed to load recommendations. Please try again later.');
      setPreferences([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setHasMounted(true);
    if (isAuthenticated) {
      fetchPreferences();
    }
  }, [isAuthenticated, fetchPreferences]);

  if (!hasMounted || !isAuthenticated) return null;

  if (preferences.length === 0 && !isLoading) return null;

  if (error) {
    return (
      <section className="my-10">
        <MaxWidthWrapper>
          <div className="text-red-500 text-center py-10">{error}</div>
        </MaxWidthWrapper>
      </section>
    );
  }

  const handleSearch = () => {
    const level =
      document.querySelector<HTMLSelectElement>('select[name="level"]')
        ?.value || '';
    const course =
      document.querySelector<HTMLSelectElement>('select[name="course"]')
        ?.value || '';
    const location =
      document.querySelector<HTMLSelectElement>('select[name="location"]')
        ?.value || '';

    router.push(`/search?level=${level}&course=${course}&location=${location}`);
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 col-span-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <Skeleton className="w-full h-48" active />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" active paragraph={false} />
                  <Skeleton className="h-4 w-1/2" active paragraph={false} />
                  <Skeleton className="h-4 w-1/3" active paragraph={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 col-span-4">
          {preferences.slice(0, 4).map((university) => {
            if (!university || typeof university !== 'object') return null;

            return (
              <div
                key={university.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={renderImage({
                      imgPath: university.universityImage || '',
                    })}
                    alt={university.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                    width={300}
                    height={160}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="/images/placeholder.jpg"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {university.name}
                  </h3>
                  {Array.isArray(university.courseSubject) &&
                    university.courseSubject.length > 0 && (
                      <p className="text-gray-600 text-sm font-medium line-clamp-1">
                        {university.courseSubject[0]?.course?.courseName ||
                          'N/A'}
                      </p>
                    )}
                  <p className="text-gray-500 text-sm">
                    {university?.destination?.name || 'Unknown Destination'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    World Ranking: {university.worldRanking}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {preferences.length > 0 && (
          <div className="hidden lg:flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg">
            <ArrowBigRight size={32} className="text-blue-600 mb-2" />
            <p className="text-gray-700 font-semibold text-lg">
              Explore More Options
            </p>
            <button
              onClick={handleSearch}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              View All
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="my-10">
      <MaxWidthWrapper>
        <div className="mb-10">
          <h2 className="text-xl sm:text-3xl font-bold italic tracking-tight text-dark-blue mb-4">
            Recommendation Based on Your Profile
          </h2>
          <p className="text-gray-500 mt-2">
            These recommendations are shown based on your preferences and
            interests.
          </p>
        </div>
        {renderContent()}
      </MaxWidthWrapper>
    </section>
  );
};

export default Recommendation;

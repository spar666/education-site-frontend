'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import Image from 'next/image';
import { ArrowBigRight } from 'lucide-react';
import useUser from 'apps/student/hook/useUser';
import { Skeleton } from 'antd';

// Interface definitions remain the same
interface Course {
  id: string;
  courseName: string;
  slug: string;
}

interface CourseSubject {
  id: string;
  course: Course;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface University {
  id: string;
  universityName: string;
  slug: string;
  worldRanking: number;
  universityImage: string | null;
  description: string;
  courseSubject: CourseSubject[];
  destination: Destination;
}

interface PreferencesResponse {
  status: string;
  message: string;
  data: {
    status: number;
    message: string;
    data: University[];
  };
}

function Recommendation() {
  const [preferences, setPreferences] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useUser();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PreferencesResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/user/preferences`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, // Replaces credentials: 'include'
          }
        );

        if (response.data.status !== 'success') {
          throw new Error('Failed to fetch preferences');
        }

        setPreferences(response.data.data.data);
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPreferences();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <section className="my-10">
        <MaxWidthWrapper>
          <div className="mb-10">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 col-span-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <Skeleton className="w-full h-32" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-10">
        <MaxWidthWrapper>
          <div className="text-red-500 text-center py-10">{error}</div>
        </MaxWidthWrapper>
      </section>
    );
  }

  if (!preferences || preferences.length === 0) {
    return null;
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 col-span-4">
            {preferences.map((university) => (
              <div
                key={university.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={
                      university.universityImage ||
                      '/images/default-university.jpg'
                    }
                    alt={university.universityName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {university.universityName}
                  </h3>
                  {university.courseSubject.length > 0 && (
                    <p className="text-gray-600 text-sm font-medium line-clamp-1">
                      {university.courseSubject[0].course.courseName}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {university.destination.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    World Ranking: {university.worldRanking}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {preferences.length > 0 && (
            <div className="hidden lg:flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg">
              <ArrowBigRight size={32} className="text-blue-600 mb-2" />
              <p className="text-gray-700 font-semibold text-lg">
                Explore More Options
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
                View All
              </button>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

export default Recommendation;

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  MapPin,
  Star,
  BookOpen,
  GraduationCap,
  Globe,
  Home,
  School,
  Phone,
  Mail,
} from 'lucide-react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import Link from 'next/link';
import { fetchUniversityBySlug } from 'apps/student/app/api/university';
import { capitalizeFirstLetter } from 'libs/utils';
import UniversityRankingCard from './RankingCard';
import { renderImage } from 'libs/services/helper';
import UniversityCampusesDetails from './Campuses';
import DetailBanner from 'apps/student/components/DetailBanner';

// Interface definitions
interface IStudyLevel {
  name: string;
}

interface ICourse {
  courseName: string;
  courseContents: string;
  slug: string;
  isFeatured: boolean;
  studyLevel: IStudyLevel;
}

interface ICourseSubject {
  course: ICourse;
}

interface ICampus {
  id: string;
  campusName: string;
  campusAddress: string;
  campusImage: string;
}

interface IUniversity {
  id: string;
  universityName: string;
  slug: string;
  universityAddress: string;
  description: string;
  worldRanking: number;
  countryRanking: number;
  universityImage: string;
  isEnglishCourseAvailable: boolean;
  universityEmail: string;
  universityContactNumber: string;
  courseSubject: ICourseSubject[];
  campuses: ICampus[];
}

interface UniversityDetailsProps {
  searchParams: { uni: string };
}

// Reusable Loading Skeleton Component
const LoadingSkeleton = () => (
  <MaxWidthWrapper>
    <div className="py-12 space-y-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </MaxWidthWrapper>
);

// Reusable Not Found Component
const NotFound = () => (
  <MaxWidthWrapper>
    <div className="py-12 text-center">
      <div className="mx-auto max-w-md">
        <School className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          University not found
        </h3>
        <p className="mt-1 text-gray-500">
          The university you're looking for doesn't exist or may have been
          removed.
        </p>
      </div>
    </div>
  </MaxWidthWrapper>
);

// Main Component
const UniversityDetails: React.FC<UniversityDetailsProps> = ({
  searchParams,
}) => {
  const { uni } = searchParams;
  const [universityDetails, setUniversityDetails] =
    useState<IUniversity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch university data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchUniversityBySlug({ uni });
        setUniversityDetails(response);
      } catch (err) {
        console.error('Failed to fetch university:', err);
        setError('Failed to load university details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (uni) fetchData();
  }, [uni]);

  // Memoized courses tabs
  const coursesTabs = useMemo(() => {
    if (!universityDetails?.courseSubject?.length) return null;

    const studyLevelsMap = new Map<string, ICourse[]>();
    universityDetails.courseSubject.forEach(({ course }) => {
      const studyLevel = capitalizeFirstLetter(course.studyLevel.name);
      const courses = studyLevelsMap.get(studyLevel) || [];
      if (!courses.some((c) => c.courseName === course.courseName)) {
        courses.push({
          courseName: course.courseName,
          courseContents: course.courseContents,
          slug: course.slug,
          isFeatured: course.isFeatured,
          studyLevel: course.studyLevel,
        });
      }
      studyLevelsMap.set(studyLevel, courses);
    });

    return Array.from(studyLevelsMap).map(([studyLevel, courses]) => (
      <section key={studyLevel} className="mb-8">
        <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
          <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
          {studyLevel} Programs
        </h3>
        {courses.length ? (
          <div className="space-y-4">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {capitalizeFirstLetter(course.courseName)}
                    </Link>
                    {course.isFeatured && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <details className="mt-4 group">
                  <summary className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="font-medium">Course Description</span>
                    <svg
                      className="ml-auto h-5 w-5 transition-transform group-open:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </summary>
                  <div
                    className="mt-3 prose prose-sm text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html:
                        course.courseContents || 'No description available',
                    }}
                  />
                </details>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            No courses available for this level
          </div>
        )}
      </section>
    ));
  }, [universityDetails]);

  // Banner Component
  const BannerComponent = () => (
    <div className="relative h-full flex items-end pb-8">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {universityDetails?.universityName}
          </h1>
          <div className="flex items-center text-gray-700 mb-4">
            <MapPin className="w-5 h-5 mr-1.5 text-blue-600" />
            <span>{universityDetails?.universityAddress}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {universityDetails?.worldRanking && (
              <span className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full text-sm font-medium text-blue-800">
                <Globe className="w-4 h-4 mr-1.5" />
                World Rank: #{universityDetails.worldRanking}
              </span>
            )}
            {universityDetails?.isEnglishCourseAvailable && (
              <span className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm font-medium text-blue-800">
                <Star className="w-4 h-4 mr-1.5" />
                English Courses
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingSkeleton />;
  if (error)
    return (
      <MaxWidthWrapper>
        <div className="py-12 text-center text-red-600">{error}</div>
      </MaxWidthWrapper>
    );
  if (!universityDetails) return <NotFound />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <DetailBanner
        height="h-96"
        component={<BannerComponent />}
        imageUrl={renderImage({
          imgPath: universityDetails.universityImage,
        })}
      />

      <MaxWidthWrapper>
        {/* Breadcrumb */}
        <nav className="py-4 text-sm text-gray-600">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600 flex items-center transition-colors"
              >
                <Home className="w-4 h-4 mr-1.5" /> Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/universities"
                className="hover:text-blue-600 transition-colors"
              >
                Universities
              </Link>
            </li>
            <li>/</li>
            <li className="text-blue-600 font-medium truncate max-w-xs">
              {universityDetails.universityName}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 py-6">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-6">
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="flex items-center text-2xl font-semibold text-gray-900 mb-6">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                University Overview
              </h2>
              <div
                className="prose text-gray-600"
                dangerouslySetInnerHTML={{
                  __html:
                    universityDetails.description || 'No overview available.',
                }}
              />
            </section>

            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="flex items-center text-2xl font-semibold text-gray-900 mb-6">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                Courses
              </h2>
              {coursesTabs || (
                <p className="text-gray-500">No courses available.</p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            <UniversityRankingCard
              worldRanking={universityDetails.worldRanking}
              countryRanking={universityDetails.countryRanking}
            />
            <UniversityCampusesDetails campuses={universityDetails.campuses} />
            {(universityDetails.universityEmail ||
              universityDetails.universityContactNumber) && (
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center text-xl font-semibold text-gray-900 mb-4">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3 text-gray-600">
                  {universityDetails.universityEmail && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <a
                        href={`mailto:${universityDetails.universityEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        {universityDetails.universityEmail}
                      </a>
                    </div>
                  )}
                  {universityDetails.universityContactNumber && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p>{universityDetails.universityContactNumber}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default UniversityDetails;

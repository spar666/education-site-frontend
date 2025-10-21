'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Heart,
  MapPin,
  Filter,
  Search as SearchIcon,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Globe,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Spin, Alert, Badge } from 'antd';
import Logo from '../../../assets/Logo/Logo.png';
import { search } from '../../api/search';
import { renderImage } from 'libs/services/helper';
import SearchFilter from './Filter';

interface University {
  id: string;
  universityName: string;
  slug: string;
  universityImage?: any;
  description?: string;
  isEnglishCourseAvailable?: boolean;
  destination?: { name: string };
}

interface SearchProps {
  searchParams: Record<string, string>;
}

const UniversityCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl bg-white shadow-md animate-pulse border border-gray-100">
    <div className="flex flex-col md:flex-row">
      <div className="relative h-56 md:h-48 md:w-64 flex-shrink-0 bg-gray-200"></div>
      <div className="p-6 flex-1 space-y-4">
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const UniversityCard: React.FC<{ university: University }> = React.memo(
  ({ university }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsFavorite((prev) => !prev);
    }, []);

    const imageSrc = renderImage({
      imgPath: university.universityImage ?? Logo,
    });

    return (
      <Link
        href={`/university/details?uni=${university.slug}`}
        prefetch={false}
        className="block hover:no-underline focus:outline-none group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300">
          <button
            onClick={toggleFavorite}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/90 backdrop-blur-sm p-2.5 shadow-md transition-all duration-200 hover:bg-white hover:scale-110"
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>

          <div className="flex flex-col md:flex-row">
            <div className="relative h-64 md:h-56 md:w-72 flex-shrink-0 overflow-hidden">
              <Image
                src={imageSrc}
                alt={`${university.universityName} logo`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 288px"
                priority={false}
              />
              {university.isEnglishCourseAvailable && (
                <span className="absolute bottom-4 left-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                  <Globe className="inline h-4 w-4 mr-1" />
                  English Available
                </span>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {university.universityName}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {university.destination?.name || 'Location not specified'}
                  </span>
                </div>

                <p
                  className="text-sm text-gray-600 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: university.description || 'No description available.',
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1.5 text-blue-600" />
                    <span className="font-semibold text-blue-600">0</span> Programs
                  </span>
                  <span className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1.5 text-cyan-600" />
                    <span className="font-semibold text-cyan-600">Top Ranked</span>
                  </span>
                </div>
                <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors group-hover:gap-2 gap-1">
                  Explore <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

UniversityCard.displayName = 'UniversityCard';

const Search: React.FC<SearchProps> = ({ searchParams = {} }) => {
  console.log(searchParams, 'serachparmas');
  // Existing state and data fetching logic remains exactly the same
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({
    destination: searchParams.destination || '',
    courseCategory: searchParams.courseCategory || '',
    qualification: searchParams.qualification || '',
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(false);

  const fetchData = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading || (!reset && !hasMore)) return;

      setLoading(true);
      setError(null);

      try {
        const limit = reset ? 5 : 10;
        const payload = {
          ...searchParams,
          ...filters,
          page: pageNum,
          limit,
        };
        
        console.log('=== Search API Call ===');
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
        console.log('Search Payload:', payload);
        console.log('Search Params:', searchParams);
        console.log('Filters:', filters);
        
        const response = await search(payload);
        
        console.log('Search API Response:', response);

        if (!isMountedRef.current) return;

        if (Array.isArray(response) && response.length > 0) {
          setUniversities((prev) =>
            reset ? response : [...prev, ...response]
          );
          setHasMore(response.length === limit);
        } else {
          setHasMore(false);
          if (reset) setUniversities([]);
        }
      } catch (err: any) {
        if (!isMountedRef.current) return;
        console.error('=== Search API Error ===');
        console.error('Error details:', err);
        console.error('Error response:', err?.response?.data);
        setError('Something went wrong. Please try again.');
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          if (reset) setInitialLoading(false);
        }
      }
    },
    [searchParams, filters, loading, hasMore]
  );

  const handleFiltersChange = useCallback(
    (newFilters: any) => {
      setFilters(newFilters);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        setUniversities([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true);
        fetchData(1, true);
      }, 500);
    },
    [fetchData]
  );

  // Initial fetch and cleanup
  useEffect(() => {
    console.log('=== Component Mounted ===');
    isMountedRef.current = true;
    fetchData(1, true);

    return () => {
      console.log('=== Component Unmounting ===');
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // Only run on mount

  // Effect for filter/search param changes (skip on initial mount)
  useEffect(() => {
    if (!isMountedRef.current) return;

    console.log('=== Filters or SearchParams Changed ===');
    console.log('Current filters:', filters);
    console.log('Current searchParams:', searchParams);

    const timer = setTimeout(() => {
      console.log('Triggering new search with updated filters/params...');
      setUniversities([]);
      setPage(1);
      setHasMore(true);
      setInitialLoading(true);
      fetchData(1, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, searchParams, fetchData]);

  // Infinite scroll setup
  useEffect(() => {
    if (initialLoading || loading || !hasMore || !isMountedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchData(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.5, rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [fetchData, hasMore, loading, initialLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero/Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream University
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              {searchParams.location 
                ? `Exploring universities in ${searchParams.location}` 
                : 'Browse through top universities and programs'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-6 rounded-xl shadow-sm"
            closable
            onClose={() => setError(null)}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Filter className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                  </div>
                  {Object.values(filters).filter(Boolean).length > 0 && (
                    <Badge
                      count={Object.values(filters).filter(Boolean).length}
                      style={{ backgroundColor: '#3B82F6' }}
                    />
                  )}
                </div>
                <SearchFilter
                  initialValues={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

              {/* Quick Stats Card */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Universities Found:</span>
                    <span className="font-bold text-blue-600 text-xl">
                      {universities.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Filters:</span>
                    <span className="font-bold text-cyan-600 text-xl">
                      {Object.values(filters).filter(Boolean).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {initialLoading
                      ? 'Searching universities...'
                      : `${universities.length} ${
                          universities.length === 1 ? 'University' : 'Universities'
                        } Found`}
                  </h3>
                  {!initialLoading && universities.length > 0 && (
                    <p className="text-gray-600 mt-1">
                      Showing the best matches for your criteria
                    </p>
                  )}
                </div>
                {!initialLoading && universities.length > 0 && (
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <span>Top Results</span>
                  </div>
                )}
              </div>
            </div>

            {/* University Cards */}
            {initialLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <UniversityCardSkeleton key={index} />
                ))}
              </div>
            ) : universities.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border-2 border-gray-100">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SearchIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Universities Found
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We couldn't find any universities matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() =>
                      handleFiltersChange({
                        courseCategory: '',
                        qualification: '',
                        destination: '',
                      })
                    }
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <X className="h-5 w-5" />
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {universities.map((uni) => (
                  <UniversityCard key={uni.id} university={uni} />
                ))}

                <div ref={loadMoreRef} className="h-4" />

                {hasMore && loading && (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <Spin size="large" />
                      <p className="mt-4 text-gray-600 font-medium">
                        Loading more universities...
                      </p>
                    </div>
                  </div>
                )}

                {!hasMore && universities.length > 0 && (
                  <div className="text-center py-8 border-t-2 border-gray-100">
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <div className="w-12 h-0.5 bg-gray-300"></div>
                      <span className="font-medium">You've reached the end</span>
                      <div className="w-12 h-0.5 bg-gray-300"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Showing all {universities.length} results
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Search);

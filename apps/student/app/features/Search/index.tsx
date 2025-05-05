'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Heart,
  MapPin,
  Filter,
  Search as SearchIcon,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Row, Col, Spin, Alert, Badge } from 'antd';
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
  <div className="relative overflow-hidden rounded-lg bg-white shadow-md animate-pulse">
    <div className="flex flex-col sm:flex-row">
      <div className="relative h-48 sm:h-40 sm:w-48 flex-shrink-0 bg-gray-200 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"></div>
      <div className="p-5 flex-1 space-y-4">
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
        className="block hover:no-underline focus:outline-none"
      >
        <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <button
            onClick={toggleFavorite}
            className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-sm transition-colors duration-150 hover:bg-gray-50"
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>

          <div className="flex flex-col sm:flex-row">
            <div className="relative h-56 sm:h-40 sm:w-48 flex-shrink-0">
              <Image
                src={imageSrc}
                alt={`${university.universityName} logo`}
                fill
                className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                sizes="(max-width: 640px) 100vw, 192px"
                priority={false}
              />
              {university.isEnglishCourseAvailable && (
                <span className="absolute bottom-3 left-3 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white shadow-md">
                  English Available
                </span>
              )}
            </div>

            <div className="p-5 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5 line-clamp-1">
                {university.universityName}
              </h3>

              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 text-blue-500 mr-1.5 flex-shrink-0" />
                <span className="line-clamp-1">
                  {university.destination?.name || 'Location not specified'}
                </span>
              </div>

              <p
                className="text-sm text-gray-600 mb-4 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: university.description || 'No description available.',
                }}
              />

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  <span className="font-medium text-blue-600">0</span> programs
                </span>
                <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Explore <ChevronRight className="ml-1 h-4 w-4" />
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
  // Existing state and data fetching logic remains exactly the same
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({
    courseCategory: searchParams.courseCategory || '',
    qualification: searchParams.qualification || '',
    destination: searchParams.destination || '',
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
        const response = await search(payload);

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
      } catch (err) {
        if (!isMountedRef.current) return;
        setError('Something went wrong. Please try again.');
        console.error('Search error:', err);
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
    isMountedRef.current = true;
    fetchData(1, true);

    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Effect for filter changes
  useEffect(() => {
    if (!isMountedRef.current) return;

    const timer = setTimeout(() => {
      setUniversities([]);
      setPage(1);
      setHasMore(true);
      setInitialLoading(true);
      fetchData(1, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, searchParams]);

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
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-6 rounded-lg"
            closable
            onClose={() => setError(null)}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-6 space-y-5">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                <div className="flex items-center mb-5">
                  <Filter className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                  {Object.values(filters).filter(Boolean).length > 0 && (
                    <Badge
                      count={Object.values(filters).filter(Boolean).length}
                      className="ml-2"
                    />
                  )}
                </div>
                <SearchFilter
                  initialValues={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {initialLoading
                  ? 'Searching universities...'
                  : `${universities.length} ${
                      universities.length === 1 ? 'Result' : 'Results'
                    } Found`}
              </h3>
            </div>

            {initialLoading ? (
              <div className="space-y-5">
                {[...Array(3)].map((_, index) => (
                  <UniversityCardSkeleton key={index} />
                ))}
              </div>
            ) : universities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200">
                <div className="max-w-md mx-auto">
                  <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    No universities found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any universities matching your criteria.
                  </p>
                  <button
                    onClick={() =>
                      handleFiltersChange({
                        courseCategory: '',
                        qualification: '',
                        destination: '',
                      })
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {universities.map((uni) => (
                  <UniversityCard key={uni.id} university={uni} />
                ))}

                <div ref={loadMoreRef} className="h-2" />

                {hasMore && loading && (
                  <div className="flex justify-center py-8">
                    <Spin tip="Loading more universities..." />
                  </div>
                )}

                {!hasMore && universities.length > 0 && (
                  <div className="text-center py-6 text-gray-500 border-t border-gray-200">
                    You've reached the end of results
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

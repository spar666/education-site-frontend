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
import { Row, Col, Spin, Alert } from 'antd';
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
  <div className="relative overflow-hidden rounded-xl bg-white shadow-sm animate-pulse">
    <div className="flex flex-col sm:flex-row">
      <div className="relative h-48 sm:h-40 sm:w-48 flex-shrink-0 bg-gray-200"></div>
      <div className="p-4 flex-1 space-y-3">
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const UniversityCard: React.FC<{ university: University }> = ({
  university,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  const imageSrc = renderImage({
    imgPath: university.universityImage ?? Logo,
    size: 'md',
  });

  return (
    <Link href={`/university/details?uni=${university.slug}`} prefetch={false}>
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <button
          onClick={toggleFavorite}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 transition-all duration-200 hover:bg-white"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
            }`}
          />
        </button>
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-40 sm:w-48 flex-shrink-0">
            <Image
              src={imageSrc}
              alt={`${university.universityName} logo`}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority={false}
            />
            {university.isEnglishCourseAvailable && (
              <span className="absolute bottom-2 left-2 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white shadow">
                English Available
              </span>
            )}
          </div>
          <div className="p-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {university.universityName}
            </h3>
            <p className="mt-1 flex items-center text-sm text-gray-600">
              <MapPin className="mr-1 h-4 w-4 text-blue-500" />
              {university.destination?.name ?? 'Location not specified'}
            </p>
            <p
              className="mt-2 text-sm text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: university.description ?? 'No description available.',
              }}
            />
            <div className="mt-3 flex items-center justify-between border-t pt-3 border-gray-100">
              <span className="text-xs text-gray-500">
                <span className="font-medium text-blue-600">0</span> programs
              </span>
              <span className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                Explore <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Search: React.FC<SearchProps> = ({ searchParams = {} }) => {
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
      }, 500); // Increased debounce time
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
  }, []); // Empty dependency array for initial load only

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
  }, [filters, searchParams]); // Only run when filters or searchParams change

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
    <section className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
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

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={7}>
          <div className="sticky top-4 space-y-4">
            <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <Filter className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <SearchFilter
                initialValues={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>
        </Col>

        <Col xs={24} lg={17}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800">
              {initialLoading
                ? 'Loading...'
                : `${universities.length} Results Found`}
            </h3>
          </div>

          {initialLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <UniversityCardSkeleton key={index} />
              ))}
            </div>
          ) : universities.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {universities.map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}

              <div ref={loadMoreRef} className="h-1" />

              {hasMore && loading && (
                <div className="space-y-4">
                  <UniversityCardSkeleton />
                  <UniversityCardSkeleton />
                </div>
              )}

              {!hasMore && !initialLoading && (
                <div className="text-center py-6 text-gray-500">
                  You've reached the end of the list
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </section>
  );
};

export default React.memo(Search);

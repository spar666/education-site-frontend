'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Spin, Alert } from 'antd';
import { MapPin, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../assets/Logo/Logo.png';
import { search } from '../../api/search';
import { renderImage } from 'libs/services/helper';
import SearchFilter, { FilterState } from './Filter';
import debounce from 'lodash/debounce';
import { Heart } from 'lucide-react';

interface SearchProps {
  searchParams: any;
}

interface University {
  id: string;
  universityName: string;
  slug: string;
  universityImage?: any;
  description?: string;
  isEnglishCourseAvailable?: boolean;
  destination?: { name: string };
}

const Search: React.FC<SearchProps> = ({ searchParams }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    courseCategory: '',
    qualification: '',
    destination: '',
  });

  const fetchData = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null);
      try {
        const requestPayload = {
          location: searchParams.location,
          level: searchParams.level,
          ...searchParams,
          ...filters,
        };

        const response = await search(requestPayload);
        if (response) {
          setUniversities(response);
        } else {
          setUniversities([]);
        }
      } catch (error) {
        setError('Failed to fetch universities. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500),
    [searchParams, filters]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <section className="container py-6 mx-auto bg-white bg-full">
      {error && (
        <Alert message={error} type="error" showIcon className="mb-4" />
      )}

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} lg={6}></Col>
      </Row>

      <Row gutter={[16, 16]} className="bg-white">
        <Col xs={24} lg={6}>
          <div className="flex items-center mb-4">
            <Filter className="h-6 w-6 text-gray-600 mr-2" />
            <span className="text-2xl font-semibold text-gray-800">
              I am looking for
            </span>
          </div>
          <SearchFilter onFiltersChange={handleFiltersChange} />
        </Col>

        <Col xs={24} lg={18}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center mt-4">
              <p className="text-lg text-gray-700">No universities found.</p>
            </div>
          ) : (
            universities.map((uni) => (
              <UniversityCard key={uni.id} university={uni} />
            ))
          )}
        </Col>
      </Row>
    </section>
  );
};

const UniversityCard = ({ university }: { university: University }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className="relative border border-gray-300 rounded-lg p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white mb-6">
      <Link href={`/university/details?uni=${university.slug}`} passHref>
        <div className="flex items-center space-x-4">
          <Image
            src={renderImage({
              imgPath: university?.universityImage || Logo,
              size: 'sm',
            })}
            alt="University Image"
            height={90}
            width={90}
            className="object-cover rounded-full border border-gray-200"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-xl text-dark-blue hover:text-blue-600 transition-colors">
              {university.universityName}
            </h3>
            <p className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-5 w-5 mr-2" />
              {university?.destination?.name || 'No location available'}
            </p>
            <div
              className="text-sm text-gray-700 line-clamp-3 mt-2"
              dangerouslySetInnerHTML={{
                __html: university.description || 'No description available.',
              }}
            />
            {university.isEnglishCourseAvailable && (
              <span className="mt-3 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                English courses available
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite icon */}
      <div className="absolute top-4 right-4">
        <Heart
          className={`h-6 w-6 cursor-pointer ${
            isFavorite ? 'text-red-500' : 'text-gray-500'
          }`}
          onClick={toggleFavorite}
        />
      </div>
    </div>
  );
};

export default Search;

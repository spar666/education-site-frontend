'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Empty,
  Pagination,
  Breadcrumb,
  Dropdown,
  Input,
  Button,
} from 'antd';
import ProgressiveImageLoading from 'apps/student/components/ProgressiveImage';
import { BookHeart, ChevronDown, Heart, Star, X } from 'lucide-react';

import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Icons } from 'apps/student/components/Icons';
import { capitalizeFirstLetter } from 'libs/utils';
import { fetchUniversityByDestination } from '../../api/university';
import Link from 'next/link';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

interface UniversityData {
  id: string;
  universityName: string;
  universityAddress: string;
  universityContactNumber: string;
  universityEmail: string;
  slug: string;
  worldRanking: number;
  countryRanking: number;
  universityImage: string | null;
  description: string;
  isFeatured: boolean;
  isEnglishCourseAvailable: boolean;
}

const University = ({ searchParams }: any) => {
  const { country } = searchParams;
  const [university, setUniversity] = useState<UniversityData[]>([]);
  const [inputFilterByCountry, setInputFilterByCountry] = useState(
    country ? capitalizeFirstLetter(country) : ''
  );
  const [inputFilterByDegree, setInputFilterByDegree] = useState('');
  const [inputFilterByUniversity, setInputFilterByUniversity] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [
    selectedUniversitiesForFavourite,
    setSelectedUniversitiesForFavourite,
  ] = useState<string[]>([]);

  const handleInputFilterByCountryChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setInputFilterByCountry(e.target.value);
  };

  const handleInputFilterByDegreeChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setInputFilterByDegree(e.target.value);
  };

  const handleInputFilterByUniversityChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setInputFilterByUniversity(e.target.value);
  };

  const handleClearInputFilterByCountry = () => {
    setInputFilterByCountry('');
  };

  const handleClearInputFilterByDegree = () => {
    setInputFilterByDegree('');
  };

  const handleClearInputFilterByUniversity = () => {
    setInputFilterByUniversity('');
  };

  const handleFavouriteUniversity = (id: string) => () => {
    const index = selectedUniversitiesForFavourite.indexOf(id);
    if (index === -1) {
      setSelectedUniversitiesForFavourite([
        ...selectedUniversitiesForFavourite,
        id,
      ]);
    } else {
      const updatedUniversities = [...selectedUniversitiesForFavourite];
      updatedUniversities.splice(index, 1);
      setSelectedUniversitiesForFavourite(updatedUniversities);
    }
  };

  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = Math.min(startIndex + pagination.limit, university.length);

  const paginatedData = university.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await fetchUniversityByDestination(country);
        console.log(response, 'response');
        setUniversity(response.universities);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      }
    };
    fetchData();
  }, [country]);

  const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    try {
      const cookieValue = JSON.stringify(selectedUniversitiesForFavourite);
      setCookie('university', cookieValue, {
        expires: new Date(Date.now() + ONE_YEAR_IN_MS), // Expires in one year
        path: '/', // Accessible across all paths on the domain
      });
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }, [selectedUniversitiesForFavourite]);

  useEffect(() => {
    return () => {
      deleteCookie('university');
      setSelectedUniversitiesForFavourite([]);
    };
  }, []);

  return (
    <section className="mx-auto">
      <MaxWidthWrapper>
        <section className="py-5 bg-gray-50">
          <div className="container mx-auto my-3">
            <Breadcrumb separator={'>'}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>
                All universities in {capitalizeFirstLetter(country)}
              </Breadcrumb.Item>
            </Breadcrumb>
            <span className="text-sm text-muted-foreground hover:text-gray-600">
              Explore {country}'s diverse universities! Filter by popularity,
              reviews, rankings, and English courses to find your perfect fit
            </span>
          </div>
        </section>

        <section className="container bg-gray-50">
          <section className="py-5 bg-white">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={18}>
                <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search By University Name"
                      className="border border-gray-300 rounded-md px-2 py-1 mr-2"
                      value={inputFilterByCountry}
                      onChange={handleInputFilterByCountryChange}
                    />
                    {inputFilterByCountry && (
                      <Button
                        type="text"
                        icon={<X />}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                        onClick={handleClearInputFilterByCountry}
                        style={{
                          fontSize: '0.5rem',
                          padding: '0.2rem',
                          lineHeight: '0.8rem',
                        }}
                      />
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Filter By Degree"
                      className="border border-gray-300 rounded-md px-2 py-1 mr-2"
                      value={inputFilterByDegree}
                      onChange={handleInputFilterByDegreeChange}
                    />
                    {inputFilterByDegree && (
                      <Button
                        type="text"
                        icon={<X />}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                        onClick={handleClearInputFilterByDegree}
                        style={{
                          fontSize: '0.5rem',
                          padding: '0.2rem',
                          lineHeight: '0.8rem',
                        }}
                      />
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Filter By University"
                      className="border border-gray-300 rounded-md px-2 py-1 mr-2"
                      value={inputFilterByUniversity}
                      onChange={handleInputFilterByUniversityChange}
                    />
                    {inputFilterByUniversity && (
                      <Button
                        type="text"
                        icon={<X />}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                        onClick={handleClearInputFilterByUniversity}
                        style={{
                          fontSize: '0.5rem',
                          padding: '0.2rem',
                          lineHeight: '0.8rem',
                        }}
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </section>

          <section className="py-4">
            <div className="bg-white flex flex-wrap gap-6 md:gap-6 justify-center md:justify-start mx-auto md:ml-10">
              {paginatedData?.map((uni) => (
                <div
                  key={uni?.id}
                  className="border border-gray-500 h-auto w-full md:w-1/3 lg:w-2/3 flex flex-col"
                >
                  <div className="flex justify-end p-4 md:p-6">
                    {selectedUniversitiesForFavourite.includes(uni?.id) ? (
                      <Star
                        onClick={handleFavouriteUniversity(uni?.id)}
                        color="#FFD700"
                      />
                    ) : (
                      <Star onClick={handleFavouriteUniversity(uni?.id)} />
                    )}
                  </div>
                  <Link href={`/university/details?uni=${uni?.slug}`}>
                    <div className="flex flex-row gap-4 md:gap-6 p-4 md:p-6">
                      <div className="flex items-center justify-center border border-gray-900 w-24 h-24 md:w-40 md:h-40">
                        <Icons.logo
                          className="h-10 w-20 md:h-16 md:w-16"
                          color="bg-electric-violet"
                        />
                      </div>
                      <div className="flex flex-col flex-grow gap-3">
                        <span className="font-bold text-black text-lg md:text-xl">
                          {uni?.universityName}
                        </span>
                        <span className="text-sm text-gray-900">
                          {uni?.universityAddress}
                        </span>
                        <span className="text-sm text-gray-900">
                          {uni?.description}
                        </span>
                        <span className="text-sm text-gray-900">
                          World Rank: {uni?.worldRanking}
                        </span>
                        <span className="text-sm text-gray-900">
                          Country Rank: {uni?.countryRanking}
                        </span>
                        {uni?.isEnglishCourseAvailable ? (
                          <span className="border border-gray-500 rounded-full text-center border-medium text-black text-sm md:text-base p-1 md:p-2">
                            English courses available
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="py-4">
            <div className="container mx-auto mb-4 text-center mt-5 flex-end bg-white">
              <Pagination
                current={pagination.page}
                total={university.length}
                pageSize={pagination.limit}
                className="mx-auto container"
                onChange={(page) => setPagination({ ...pagination, page })}
              />
            </div>
          </section>
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default University;

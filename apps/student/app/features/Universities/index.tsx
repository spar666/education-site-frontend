'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Row, Col, Empty, Pagination, Breadcrumb } from 'antd';
import { Star } from 'lucide-react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Icons } from 'apps/student/components/Icons';
import { capitalizeFirstLetter } from 'libs/utils';
import { fetchUniversityByDestination } from '../../api/university';
import Link from 'next/link';
import { renderImage } from 'libs/services/helper';
import Image from 'next/image';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

interface UniversityData {
  id: string;
  universityName: string;
  universityAddress: string;
  slug: string;
  worldRanking: number;
  countryRanking: number;
  universityImage: string | null;
  description: string;
  isEnglishCourseAvailable: boolean;
}

const University = ({ searchParams }: any) => {
  const { country } = searchParams;
  const [university, setUniversity] = useState<UniversityData[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [
    selectedUniversitiesForFavourite,
    setSelectedUniversitiesForFavourite,
  ] = useState<string[]>([]);

  const handleFavouriteUniversity = (id: string) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await fetchUniversityByDestination(country);
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
      console.log('Setting cookie:', cookieValue);
      setCookie('university', cookieValue, {
        expires: new Date(Date.now() + ONE_YEAR_IN_MS), // Expires in one year
        path: '/', // Accessible across all paths on the domain
      });
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }, [selectedUniversitiesForFavourite]);

  useEffect(() => {
    console.log('Selected universities:', selectedUniversitiesForFavourite);
    return () => {
      console.log('Deleting cookie');
      deleteCookie('university');
      setSelectedUniversitiesForFavourite([]);
    };
  }, []);

  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = Math.min(startIndex + pagination.limit, university.length);
  const paginatedData = university.slice(startIndex, endIndex);

  return (
    <section className="mx-auto bg-white">
      <MaxWidthWrapper>
        <section className="py-5 bg-white">
          <div className="container mx-auto my-3">
            <Breadcrumb separator={'>'}>
              <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue">
                All universities in {capitalizeFirstLetter(country)}
              </Breadcrumb.Item>
            </Breadcrumb>
            <span className="text-sm text-navy-blue hover:text-gray-600">
              Explore {country}'s diverse universities! Filter by popularity,
              reviews, rankings, and English courses to find your perfect fit
            </span>
          </div>
        </section>

        <section className="container bg-white">
          {university.length === 0 ? (
            <Empty description="No Universities found" />
          ) : (
            <>
              <section className="py-3 md:py-5 bg-white">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={18}>
                    {/* Enable filter if needed */}
                  </Col>
                </Row>
              </section>

              <section className="w-full py-3 md:py-4 font-Open_Sans leading-1.5 text-base">
                <div className="bg-white flex flex-wrap gap-6 md:gap-6 justify-center md:justify-start mx-auto md:ml-10">
                  {paginatedData?.map((uni) => (
                    <div
                      key={uni?.id}
                      className="border border-gray-500 h-auto rounded w-[400px] sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col"
                    >
                      <div className="flex justify-end p-3 md:p-4">
                        <Star
                          onClick={() => handleFavouriteUniversity(uni?.id)}
                          color={
                            selectedUniversitiesForFavourite.includes(uni?.id)
                              ? '#FFD700'
                              : undefined
                          }
                          style={{ cursor: 'pointer' }}
                        />
                      </div>

                      <Link href={`/university/details?uni=${uni?.slug}`}>
                        <div className="flex flex-col p-3 md:p-4">
                          <div className="flex items-center w-full justify-center mb-3 md:mb-4">
                            {uni.universityImage ? (
                              <Image
                                src={renderImage({
                                  imgPath: uni?.universityImage,
                                  size: 'md',
                                })}
                                alt="University Image"
                                className="object-cover w-16 h-16 md:w-24 md:h-24"
                                width={100}
                                height={100}
                              />
                            ) : (
                              <Icons.logo
                                className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center"
                                color="bg-electric-violet"
                              />
                            )}
                          </div>

                          <div className="flex flex-col font-Open_Sans flex-grow gap-2 md:gap-3">
                            <span className="font-bold text-dark-blue text-lg md:text-xl">
                              {uni?.universityName}
                            </span>
                            <span className="text-sm text-gray-900">
                              {uni?.universityAddress}
                            </span>
                            <span className="text-sm text-gray-900">
                              {uni?.description.length > 100
                                ? `${uni.description.substring(0, 100)}...`
                                : uni.description}
                            </span>
                            <div className="flex flex-wrap gap-2 md:gap-4">
                              <span className="text-sm inline-block">
                                World Ranking:
                              </span>{' '}
                              <button className="w-20 h-7 px-2 md:px-4 py-1 mb-2 md:mb-0 bg-dark-blue text-white text-center rounded-full inline-block">
                                {uni?.worldRanking}
                              </button>
                              <span className="text-sm inline-block">
                                Country Ranking:
                              </span>{' '}
                              <button className="w-20 h-7 px-2 md:px-4 py-1 mb-2 md:mb-0 bg-dark-blue text-white text-center rounded-full inline-block">
                                {uni?.countryRanking}
                              </button>
                            </div>
                            {uni?.isEnglishCourseAvailable && (
                              <span className="bg-dark-blue rounded-full text-white text-center text-sm md:text-base px-2 py-1 md:px-3 md:py-2">
                                English courses available
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              <section className="py-3 md:py-4">
                <div className="container mx-auto mb-4 text-center mt-5 bg-white">
                  <Pagination
                    current={pagination.page}
                    total={university.length}
                    pageSize={pagination.limit}
                    className="mx-auto container"
                    onChange={(page) => setPagination({ ...pagination, page })}
                  />
                </div>
              </section>
            </>
          )}
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default University;

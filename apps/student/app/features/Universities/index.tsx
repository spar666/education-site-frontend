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
import DetailBanner from 'apps/student/components/DetailBanner';
import CustomSearch from 'apps/student/components/CustomSearch.tsx';

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

  function Component() {
    return (
      <section className="py-4">
        <h1 className="text-white text-2xl md:text-3xl font-bold">
          All subject areas for Undergraduate courses.
        </h1>
        <h2 className="text-white text-xl mt-4">
          Explore the subject areas below to view related courses and find the
          course that’s right for you.
        </h2>
      </section>
    );
  }
  return (
    <section className="mx-auto bg-white overflow-hidden">
      <DetailBanner height="h-[250px]" component={<Component />} />
      <MaxWidthWrapper>
        <section className="pt-3 pb-5 bg-white">
          <div className="px-5 sm:px-10 md:px-14 lg:px-24 my-3">
            <Breadcrumb separator={'>'}>
              <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue font-bold">
                All Universities in {capitalizeFirstLetter(country)}
              </Breadcrumb.Item>
            </Breadcrumb>
            <span className="text-sm text-navy-blue hover:text-gray-500 italic">
              Explore {country}'s diverse universities! Filter by popularity,
              reviews, rankings, and English courses to find your perfect fit
            </span>
          </div>
        </section>
        <section className="flex justify-center md:justify-start  px-5 sm:px-10 md:px-14 lg:px-24 ">
          <CustomSearch />
        </section>
        <section className="px-5 sm:px-10 md:px-14 lg:px-24 bg-white  mt-14">
          {university.length === 0 ? (
            <div className="py-32 flex w-full items-center justify-center">
              <Empty description="No Universities found" />
            </div>
          ) : (
            <>
              <section className="w-full py-3 md:py-4 font-Open_Sans leading-1.5 text-base">
                <div className="bg-white card-grid">
                  {paginatedData?.map((uni) => (
                    <div
                      key={uni?.id}
                      className="border border-gray-500 h-auto rounded-xl flex flex-col overflow-hidden"
                    >
                      <Link href={`/university/details?uni=${uni?.slug}`}>
                        <div className="flex flex-col ">
                          <div className="flex items-center w-full justify-center mb-3 md:mb-4">
                            {uni.universityImage && (
                              <Image
                                src={renderImage({
                                  imgPath: uni?.universityImage,
                                  size: 'md',
                                })}
                                alt="University Image"
                                className="object-cover w-full h-full bg-[#000]"
                                width={100}
                                height={100}
                              />
                            )}
                          </div>

                          <div className="flex flex-col font-Open_Sans flex-grow px-5 ">
                            <h2 className="font-bold text-dark-blue text-lg md:text-xl ">
                              {uni?.universityName}
                            </h2>
                            <span className="text-sm text-gray-600 mb-3">
                              {uni?.universityAddress}
                            </span>
                            <span className="text-sm text-gray-600">
                              {uni?.description.length > 100
                                ? `${uni.description.substring(0, 100)}...`
                                : uni.description}
                            </span>
                            <div className="mt-3">
                              <div className=" flex justify-between items-center pl-2 mb-2">
                                <span className="text-sm inline-block text-dark-blue font-semibold">
                                  World Ranking:
                                </span>{' '}
                                <h2 className="bg-secondary-yellow  py-1 font-semibold text-lg w-14 text-center">
                                  {uni?.worldRanking}
                                </h2>
                              </div>
                              {/* <div className=" flex justify-between items-center pl-2 mb-2">
                                <span className="text-sm inline-block text-dark-blue font-semibold">
                                  Country Ranking:
                                </span>{' '}
                                <h2 className="bg-secondary-yellow  py-1 font-semibold text-lg w-14 text-center">
                                  {uni?.countryRanking}
                                </h2>
                              </div> */}
                            </div>
                            {/* what is this below section? */}
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

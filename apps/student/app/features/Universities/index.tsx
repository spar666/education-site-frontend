'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col, Empty, Pagination, Breadcrumb, Spin } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { fetchUniversityByDestination } from '../../api/university';
import { capitalizeFirstLetter } from 'libs/utils';
import DetailBanner from 'apps/student/components/DetailBanner';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { renderImage } from 'libs/services/helper';

interface UniversityData {
  id: string;
  universityName: string;
  universityAddress: string;
  slug: string;
  worldRanking: number;
  universityImage: string | null;
  description: string;
  isEnglishCourseAvailable: boolean;
}

const University = ({ searchParams }: any) => {
  const { country } = searchParams;
  const [university, setUniversity] = useState<UniversityData[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchUniversityByDestination(country);
        setUniversity(response.universities);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [country]);

  const paginatedData = university.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  return (
    <section className="bg-white overflow-hidden">
      <DetailBanner
        height="h-[250px]"
        component={
          <section className="py-4 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              All Universities in {capitalizeFirstLetter(country)}
            </h1>
            <h2 className="text-xl mt-4">
              Find your ideal university with our curated list of options.
            </h2>
          </section>
        }
      />
      <MaxWidthWrapper>
        <section className="py-3 bg-white">
          <div className="px-5 md:px-14 lg:px-24">
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <Link href="/" className="hover:text-gray-500">
                  Home
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="font-bold">
                Universities in {capitalizeFirstLetter(country)}
              </Breadcrumb.Item>
            </Breadcrumb>
            <p className="text-sm text-gray-500 mt-2">
              Discover universities by popularity, rankings, and course
              availability.
            </p>
          </div>
        </section>
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : university.length === 0 ? (
          <div className="py-32 flex items-center justify-center">
            <Empty description="No Universities found" />
          </div>
        ) : (
          <>
            <section className="px-5 md:px-14 lg:px-24 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedData.map((uni) => (
                  <div
                    key={uni.id}
                    className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                  >
                    <Link href={`/university/details?uni=${uni.slug}`}>
                      {uni.universityImage && (
                        <Image
                          src={renderImage({
                            imgPath: uni.universityImage,
                            size: 'md',
                          })}
                          alt={uni.universityName}
                          className="w-full h-40 object-cover rounded-t-lg"
                          width={300}
                          height={160}
                        />
                      )}
                      <div className="p-4">
                        <h2 className="font-bold text-lg">
                          {uni.universityName}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">
                          {uni.universityAddress}
                        </p>
                        <p className="text-sm text-gray-600">
                          {uni.description.length > 100
                            ? `${uni.description.substring(0, 100)}...`
                            : uni.description}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-sm font-semibold">
                            World Ranking:
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {uni.worldRanking}
                          </span>
                        </div>
                        {uni.isEnglishCourseAvailable && (
                          <div className="mt-2">
                            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                              English Courses Available
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
            <section className="py-4">
              <Pagination
                current={pagination.page}
                total={university.length}
                pageSize={pagination.limit}
                onChange={(page) => setPagination({ ...pagination, page })}
              />
            </section>
          </>
        )}
      </MaxWidthWrapper>
    </section>
  );
};

export default University;

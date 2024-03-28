'use client';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Breadcrumb,
  Typography,
  Image,
  Tabs,
  Carousel,
  Button,
  Empty,
  notification,
} from 'antd';
import { MapPin, ChevronRight } from 'lucide-react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import Link from 'next/link';
import { fetchUniversityBySlug } from 'apps/student/app/api/university';
import { capitalizeFirstLetter } from 'libs/utils';
import UniversityRankingCard from './RankingCard';
import UniversityFinanceDetails from './Finances';

const { TabPane } = Tabs;

const UniversityDetails = ({ searchParams }: any) => {
  const { uni } = searchParams;
  const [universityDetails, setUniversityDetails] = useState<any>();
  const [subjects, setSubjects] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await fetchUniversityBySlug({ uni });
        setUniversityDetails(response.university);
        setSubjects(response.subject);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      }
    };
    fetchData();
  }, [uni]);

  const coursesTabs = useMemo(() => {
    const studyLevelsMap = new Map();
    universityDetails?.courses?.forEach((course: any) => {
      const studyLevelName = capitalizeFirstLetter(course.studyLevel.name);
      if (!studyLevelsMap.has(studyLevelName)) {
        studyLevelsMap.set(studyLevelName, []);
      }
      const coursesForStudyLevel = studyLevelsMap.get(studyLevelName);
      if (
        !coursesForStudyLevel.some(
          (c: any) => c.courseName === course.courseName
        )
      ) {
        coursesForStudyLevel.push({
          courseName: course.courseName,
          courseLink: `/course/details?course=${course.slug}`,
        });
      }
    });
    return Array.from(studyLevelsMap).map(([studyLevelName, courses]) => (
      <TabPane key={studyLevelName} tab={studyLevelName}>
        {courses.length > 0 ? (
          <ul>
            {courses.map((course: any, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight size={16} />
                <Link href={course.courseLink}>{course.courseName}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            description={
              <Typography.Text className="text-2xl">
                No Courses found
              </Typography.Text>
            }
          />
        )}
      </TabPane>
    ));
  }, [universityDetails]);

  return (
    <section className="mx-auto">
      <MaxWidthWrapper>
        <section className="py-5 bg-gray-50">
          <div className="container mx-auto my-3">
            <Breadcrumb separator=">">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="/countries">Countries</Breadcrumb.Item>
              <Breadcrumb.Item>
                {universityDetails?.universityName}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </section>

        <section className="container bg-gray-50">
          {universityDetails ? (
            <>
              <section className="py-4">
                <div className="bg-white flex flex-col md:flex-row gap-6 justify-center md:justify-start mx-auto md:ml-10 p-6">
                  <div className="flex items-center justify-center border border-gray-900 w-10 h-10 md:w-40 md:h-40">
                    <Image
                      src={universityDetails?.universityImage || ''}
                      alt="University Logo"
                      width={160}
                      height={160}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Typography.Title level={2}>
                      {universityDetails?.universityName}
                    </Typography.Title>
                    <div className="flex flex-wrap items-center gap-4">
                      <MapPin size={20} />
                      <Typography.Text>
                        {universityDetails?.universityAddress}
                      </Typography.Text>
                    </div>
                    <div className="flex gap-4">
                      <Typography.Text>
                        World Ranking: {universityDetails?.worldRanking}
                      </Typography.Text>
                      <Typography.Text>
                        Country Ranking: {universityDetails?.countryRanking}
                      </Typography.Text>
                    </div>
                  </div>
                </div>
              </section>

              <section className="py-4">
                <div className="bg-white p-6 mx-auto md:ml-10">
                  <Typography.Title level={3}>
                    University Overview
                  </Typography.Title>
                  <span className="text-bold text-gray-500 text-1xl">
                    {universityDetails?.description}
                  </span>
                </div>
              </section>

              <section className="py-4">
                <div className="bg-white p-6 mx-auto md:ml-10">
                  <Typography.Title level={3}>
                    University Ranking
                  </Typography.Title>
                  <Typography.Paragraph>
                    <UniversityRankingCard
                      worldRanking={universityDetails?.worldRanking}
                      countryRanking={universityDetails?.countryRanking}
                    />
                  </Typography.Paragraph>
                </div>
              </section>

              <section className="py-4">
                <div className="bg-white p-6 mx-auto md:ml-10">
                  <Typography.Title level={3}>Finance Details</Typography.Title>
                  <UniversityFinanceDetails
                    financeDetails={universityDetails?.financeDetails}
                  />
                </div>
              </section>

              <section className="py-4">
                <div className="bg-white p-6 mx-auto md:ml-10">
                  <Typography.Title level={3}>
                    Courses at {universityDetails?.universityName}
                  </Typography.Title>
                  <Tabs defaultActiveKey="1">{coursesTabs}</Tabs>
                </div>
              </section>
            </>
          ) : (
            <Empty description="University details not found" />
          )}
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default UniversityDetails;

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Breadcrumb,
  Typography,
  Image,
  Tabs,
  Empty,
  Card,
  List,
  Collapse,
} from 'antd';
import { MapPin } from 'lucide-react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import Link from 'next/link';
import { fetchUniversityBySlug } from 'apps/student/app/api/university';
import { capitalizeFirstLetter } from 'libs/utils';
import UniversityRankingCard from './RankingCard';
import { renderImage } from 'libs/services/helper';
import DetailBanner from 'apps/student/components/DetailBanner';
import UniversityCampusesDetails from './Campuses';

interface IFinanceDetail {
  id: string;
  tuitionFee: string;
  currency: string;
  financialAidAvailable: boolean;
  scholarshipDetails: string;
  createdAt: Date | null;
  createdBy: string | null;
  updatedAt: Date | null;
  updatedBy: string | null;
}

interface IStudyLevel {
  name: string;
}

interface ICourse {
  id: string;
  courseName: string;
  slug: string;
  description: string;
  isFeatured: boolean;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
  isActive: boolean;
  isDelete: boolean;
  studyLevel: IStudyLevel;
  financeDetails: IFinanceDetail[];
}

interface ISubject {
  id: string;
  subjectName: string;
  description: string;
  isFeatured: boolean;
  startDate: Date | null;
  duration: string | null;
  createdAt: Date | null;
  createdBy: string | null;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
  isActive: boolean;
  isDelete: boolean;
}

interface ICourseSubject {
  id: string;
  createdAt: Date | null;
  createdBy: string | null;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
  isActive: boolean;
  isDelete: boolean;
  course: ICourse;
  subject: ISubject;
}

interface ICampus {
  id: string;
  location: string;
  email: string;
  contact: string;
  createdAt: Date | null;
  createdBy: string | null;
  updatedAt: Date | null;
  updatedBy: string | null;
}

interface IUniversity {
  id: string;
  universityName: string;
  universityAddress: string;
  universityContactNumber: string;
  universityEmail: string;
  slug: string;
  worldRanking: number;
  countryRanking: number;
  universityImage: string;
  description: string;
  isFeatured: boolean;
  isEnglishCourseAvailable: boolean;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
  isActive: boolean;
  isDelete: boolean;
  financeDetails: IFinanceDetail[]; // Optional: Global financial details
  courseSubject: ICourseSubject[];
  campuses: ICampus[];
}

const { TabPane } = Tabs;
const { Panel } = Collapse;

const UniversityDetails = ({ searchParams }: any) => {
  const { uni } = searchParams;
  const [universityDetails, setUniversityDetails] =
    useState<IUniversity | null>(null);

  // Fetch university details on component mount or when 'uni' changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: IUniversity = await fetchUniversityBySlug({ uni });
        setUniversityDetails(response);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      }
    };
    fetchData();
  }, [uni]);

  // Process courses and group them by study level
  const coursesTabs = useMemo(() => {
    if (!universityDetails?.courseSubject) return null;

    // Map to group courses by study level
    const studyLevelsMap = new Map<string, any[]>();

    universityDetails.courseSubject.forEach((courseSubject: ICourseSubject) => {
      const studyLevel = capitalizeFirstLetter(
        courseSubject.course.studyLevel.name
      );

      // Initialize study level in map if not present
      if (!studyLevelsMap.has(studyLevel)) {
        studyLevelsMap.set(studyLevel, []);
      }

      const coursesForStudyLevel: any = studyLevelsMap.get(studyLevel);

      // Check if the course already exists in the study level
      let existingCourse = coursesForStudyLevel.find(
        (c: any) => c.courseName === courseSubject.course.courseName
      );

      if (existingCourse) {
        // Avoid adding duplicate subjects
        const subjectExists = existingCourse.universityCourseSubjects.some(
          (sub: ISubject) => sub.id === courseSubject.subject.id
        );
        if (!subjectExists) {
          existingCourse.universityCourseSubjects.push(courseSubject.subject);
        }

        // Optionally, merge financial details if they differ
        // Assuming financial details are consistent per course
      } else {
        // If course doesn't exist, add it with the current subject and financial details
        coursesForStudyLevel.push({
          courseName: courseSubject.course.courseName,
          courseLink: `/course/details?university=${universityDetails.id}&course=${courseSubject.course.slug}`,
          financeDetails: courseSubject.course.financeDetails,
          universityCourseSubjects: [courseSubject.subject],
        });
      }
    });

    // Generate Tab Panes for each study level
    return Array.from(studyLevelsMap).map(([studyLevel, courses], index) => (
      <TabPane
        key={index.toString()}
        tab={studyLevel}
        className="text-base font-Open_Sans"
      >
        {courses.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={courses}
            renderItem={(course: any) => (
              <List.Item key={course.courseName}>
                <Card
                  title={
                    <Link
                      href={course.courseLink}
                      className="text-xl font-bold"
                    >
                      {capitalizeFirstLetter(course.courseName)}
                    </Link>
                  }
                >
                  <Collapse bordered={false} ghost>
                    {/* Subjects Panel */}
                    <Panel
                      header={<h1 className="text-lg">Subjects</h1>}
                      key="1"
                    >
                      {course.universityCourseSubjects.length > 0 ? (
                        <ul className="pl-5 space-y-2">
                          {course.universityCourseSubjects.map(
                            (subject: ISubject) => (
                              <li
                                key={subject.id}
                                className="text-base text-gray-800"
                              >
                                <Link
                                  href={`/subject/${subject.id}`}
                                  className="text-sm"
                                >
                                  {subject.subjectName}
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <Empty description="No Subjects Available" />
                      )}
                    </Panel>

                    {/* Financial Details Panel */}
                    <Panel
                      header={<h1 className="text-lg">Financial Details</h1>}
                      key="2"
                    >
                      {course.financeDetails.length > 0 ? (
                        course.financeDetails.map((finance: IFinanceDetail) => (
                          <Card key={finance.id} className="mb-2">
                            <p className="text-sm">
                              <strong>Tuition Fee:</strong> {finance.tuitionFee}{' '}
                              {finance.currency}
                            </p>
                            <p className="text-sm">
                              <strong>Financial Aid Available:</strong>{' '}
                              {finance.financialAidAvailable ? 'Yes' : 'No'}
                            </p>
                            <p className="text-sm">
                              <strong>Scholarship Details:</strong>{' '}
                              {finance.scholarshipDetails}
                            </p>
                          </Card>
                        ))
                      ) : (
                        <Empty description="No Financial Details Available" />
                      )}
                    </Panel>
                  </Collapse>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description={
              <Typography.Text className="text-2xl">
                No Courses Found
              </Typography.Text>
            }
          />
        )}
      </TabPane>
    ));
  }, [universityDetails]);

  // Component for the banner
  function BannerComponent() {
    return (
      <section className="py-4">
        <div className="flex flex-col text-black md:flex-row gap-6 justify-center md:justify-start">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-white font-bold text-2xl md:text-3xl">
                {universityDetails?.universityName}
              </h1>
              <h1 className="text-white">
                {universityDetails?.universityAddress}
              </h1>
            </div>

            <div className="flex gap-4 flex-col">
              {universityDetails?.worldRanking && (
                <span className="text-white">
                  World Ranking: {universityDetails.worldRanking}
                </span>
              )}
              {/* Uncomment if country ranking is needed */}
              {/* {universityDetails?.countryRanking && (
                <span className="text-white">
                  Country Ranking: {universityDetails.countryRanking}
                </span>
              )} */}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto overflow-hidden">
      {/* Detail Banner */}
      <DetailBanner height="h-[350px]" component={<BannerComponent />} />

      {/* Main Content Wrapper */}
      <MaxWidthWrapper>
        {/* Breadcrumb Navigation */}
        <section className="pb-5 pt-3 bg-white">
          <div className="px-5 sm:px-10 md:px-14 lg:px-24 mx-auto my-3">
            <Breadcrumb separator=">">
              <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue">
                University
              </Breadcrumb.Item>
              <Breadcrumb.Item className="text-navy-blue">
                {universityDetails?.universityName}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </section>

        {/* Main Content Sections */}
        <section className="px-5 sm:px-10 md:px-14 lg:px-24 bg-white leading-6 flex items-start flex-col md:flex-row">
          {/* Left Section: University Overview and Courses */}
          <div className="w-full md:w-2/3 md:pr-20">
            {universityDetails ? (
              <>
                {/* University Overview */}
                <section className="py-4 font-Open_Sans">
                  <div className="bg-white">
                    <h1 className="text-dark-blue font-bold text-2xl md:text-3xl">
                      University Overview
                    </h1>
                    <p className="text-base leading-6 mt-5">
                      {universityDetails.description}
                    </p>
                  </div>
                </section>

                {/* Courses Section */}
                <section className="py-4 font-Open_Sans">
                  <div className="bg-white">
                    <h1 className="text-dark-blue font-bold text-2xl md:text-3xl mb-5">
                      Courses at {universityDetails.universityName}
                    </h1>

                    {coursesTabs ? (
                      <Tabs defaultActiveKey="1" type="card">
                        {coursesTabs}
                      </Tabs>
                    ) : (
                      <Empty description="No Courses Available" />
                    )}
                  </div>
                </section>
              </>
            ) : (
              <Empty description="University details not found" />
            )}
          </div>

          {/* Right Section: Rankings and Campuses */}
          <div className="w-full md:w-1/3">
            {/* University Ranking */}
            <section className="py-4">
              <div className="bg-white">
                <h1 className="text-dark-blue font-bold text-2xl md:text-3xl">
                  University Ranking
                </h1>
                <UniversityRankingCard
                  worldRanking={universityDetails?.worldRanking}
                  // countryRanking={universityDetails?.countryRanking} // Uncomment if needed
                />
              </div>
            </section>

            {/* Campuses */}
            <section className="py-4">
              <div className="bg-white">
                <h1 className="text-dark-blue font-bold text-2xl md:text-3xl">
                  Campuses
                </h1>
                <UniversityCampusesDetails
                  campuses={universityDetails?.campuses}
                />
              </div>
            </section>
          </div>
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default UniversityDetails;

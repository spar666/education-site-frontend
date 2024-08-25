'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Typography } from 'antd';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import SubjectList from '../SubjectList';
import { fetchSubjectByCourse } from 'apps/student/app/api/courses';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import DetailBanner from 'apps/student/components/DetailBanner';
import CustomSearch from 'apps/student/components/CustomSearch.tsx';
import BlogPage from 'apps/student/app/pages/Blogs';

const { Text } = Typography;

const CourseDetails = ({
  searchParams,
}: {
  searchParams: { course: string };
}) => {
  const { course } = searchParams;
  const [universityDetails, setUniversityDetails] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSubjectByCourse({ course });
        setUniversityDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      }
    };
    fetchData();
  }, [course]);

  const universityName = universityDetails?.universities?.[0]?.universityName;
  const universityImage = universityDetails?.universities?.[0]?.universityImage;
  const worldRanking = universityDetails?.universities?.[0]?.worldRanking;
  const countryRanking = universityDetails?.universities?.[0]?.countryRanking;
  const unidesc = universityDetails?.universities?.[0]?.description;
  const subject = universityDetails?.subject.flat();
  const level = universityDetails?.studyLevel?.name;
  const financeDetails = universityDetails?.universities?.[0].financeDetails;
  const destination = universityDetails?.universities?.[0].destination?.name;

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
        <section className="py-5 bg-white">
          <div className="container mx-auto my-3">
            <Breadcrumb separator=">">
              <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue">
                {universityDetails?.courseName}
              </Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue">
                {universityName}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </section>

        <section className="bg-white px-5 sm:px-10 md:px-14 lg:px-24 ">
          <section className="py-4">
            <div className="bg-white">
              {/* <div className="flex flex-row gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex flex-col p-5 gap-3">
                  <h1 className="flex font-bold text-2xl font-['quicksand'] text-dark-blue ">
                    {subject?.length} subjects found in{' '}
                    {universityDetails?.courseName} <br /> {universityName}
                  </h1>
                  <div className="flex flex-wrap text-navy-blue">
                    <MapPin />{' '}
                    <Text className="text-md text-navy-blue">
                      {destination}
                    </Text>
                  </div>
                  <div className="flex flex-wrap justify-between items-center  gap-2">
                    <div>
                      World Ranking:{' '}
                      <Text className="text-md text-navy-blue">
                        {worldRanking}
                      </Text>
                    </div>
                    <div>
                      Country Ranking:{' '}
                      <Text className="text-md text-navy-blue">
                        {countryRanking}
                      </Text>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-15 md:gap-6 py-4 md:py-6 w-full">
                  <SubjectList
                    subjects={[subject]}
                    level={level}
                    financeDetails={financeDetails}
                  />
                </div>
              </div>
            </div>
          </section>
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default CourseDetails;

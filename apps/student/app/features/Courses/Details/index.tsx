'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Typography } from 'antd';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import SubjectList from '../SubjectList';
import { fetchSubjectByCourse } from 'apps/student/app/api/courses';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

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

  return (
    <section className="mx-auto">
      <MaxWidthWrapper>
        <section className="py-5 bg-gray-50">
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

        <section className="container bg-white font-[Open_Sans]">
          <section className="py-4">
            <div className="bg-white flex flex-col gap-6 md:gap-6 justify-center md:justify-start mx-auto md:ml-10">
              <div className="flex flex-row gap-4 md:gap-6 p-4 md:p-6">
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
                  <div className="flex flex-wrap gap-2">
                    World Ranking:{' '}
                    <Text className="text-md text-navy-blue">
                      {worldRanking}
                    </Text>
                    Country Ranking:{' '}
                    <Text className="text-md text-navy-blue">
                      {countryRanking}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-15 md:gap-6 p-4 md:p-6 w-full">
                  <SubjectList
                    subjects={[subject]}
                    level={level}
                    financeDetails={financeDetails}
                  />
                </div>
                <div className="flex flex-col  font-['Open_Sans'] gap-6 md:gap-6  w-full  leading-1.5">
                  <h1 className="flex font-bold text-2xl text-dark-blue">
                    About {universityName}
                  </h1>
                  <div className="flex flex-row overflow-auto">
                    <div className="w-full md:w-1/2">
                      <p className="text-md">{unidesc}</p>
                    </div>
                    <div className="w-full md:w-1/2">
                      <img
                        src="/path/to/your/image.jpg"
                        alt="University Image"
                        className="h-auto md:h-full max-h-full"
                      />
                    </div>
                  </div>
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

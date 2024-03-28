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

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

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
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Australia</Breadcrumb.Item>
              <Breadcrumb.Item>Applied and Pure Science</Breadcrumb.Item>
              <Breadcrumb.Item>{universityName}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </section>

        <section className="container bg-gray-50">
          <section className="py-4">
            <div className="bg-white flex flex-col gap-6 md:gap-6 justify-center md:justify-start mx-auto md:ml-10">
              <div className="flex flex-row gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-center border border-gray-900 w-10 h-10 md:w-40 md:h-40">
                  <div className="logo-wrapper">
                    <Image
                      src={universityImage || ''}
                      alt="uni log"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="flex flex-col p-5 gap-3">
                  <h1 className="flex font-bold text-2xl">
                    {subject?.length} subjects found in{' '}
                    {universityDetails?.courseName} <br /> {universityName}
                  </h1>
                  <div className="flex flex-wrap">
                    <MapPin /> <Text className="text-md">{destination}</Text>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    World Ranking:{' '}
                    <Text className="text-md">{worldRanking}</Text>
                    Country Ranking:{' '}
                    <Text className="text-md">{countryRanking}</Text>
                  </div>
                </div>
              </div>
              <div
                ref={containerRef}
                className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 w-full overflow-hidden"
              >
                <SubjectList
                  subjects={[subject]}
                  level={level}
                  financeDetails={financeDetails}
                />
              </div>
              <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 h-[300px] w-full">
                <h1 className="flex font-bold text-2xl">
                  About {universityName}
                </h1>
                <div className="flex flex-row">
                  <div className="w-1/2">
                    <p className="text-md">{unidesc}</p>
                  </div>
                  <div className="w-1/2">
                    <img
                      src="/path/to/your/image.jpg"
                      alt="University Image"
                      className="h-full max-h-full"
                    />
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

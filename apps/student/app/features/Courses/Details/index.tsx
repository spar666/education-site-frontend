'use client';
import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Typography,
  Tabs,
  Row,
  Col,
  Select,
  Button,
  Empty,
  Pagination,
} from 'antd';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import SubjectList from '../SubjectList';
import { fetchUniversitySubjectByUniversitySlug } from 'apps/student/app/api/university';
import DetailBanner from 'apps/student/components/DetailBanner';
import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '../../RegisterForm';
import { renderImage } from 'libs/services/helper';
import { X } from 'lucide-react';

const { Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface SearchParams {
  course: string;
  university: string;
}

interface UniversityDetails {
  id: string;
  universityName: string;
  courseSubject: {
    id: string;
    subject: string;
    course?: {
      financeDetails: { fee: number; currency: string }[];
      studyLevel: string;
    };
  }[];
}

interface CourseDetailsProps {
  searchParams: SearchParams;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ searchParams }) => {
  const maxLengthOfDescription = 400;
  const { course, university } = searchParams;
  const [universityDetails, setUniversityDetails] = useState<any>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [destination, setDestination] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUniversitySubjectByUniversitySlug({
          course,
          university,
        });
        setUniversityDetails(response?.data || []);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      }
    };

    fetchData();
  }, [course, university]);

  const handleCountryChange = (value: string) => setSelectedCountry(value);

  const handleClearCountryFilter = () => setSelectedCountry(null);

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedUniversities = Array.isArray(universityDetails)
    ? universityDetails.slice(startIndex, endIndex)
    : [];

  return (
    <section className="mx-auto">
      <MaxWidthWrapper>
        <section className={'py-5 bg-gray-50'}>
          <div className="px-5 sm:px-10 md:px-14 lg:px-24 my-3">
            <Breadcrumb separator={'>'}>
              <Breadcrumb.Item className="text-dark-blue">Home</Breadcrumb.Item>
              <Breadcrumb.Item className="text-dark-blue font-semibold">
                Courses
              </Breadcrumb.Item>
            </Breadcrumb>
            <span className="text-gray-600 italic">
              {universityDetails.length} Universities offering {course} courses
            </span>
          </div>
        </section>
        <div className="px-5 sm:px-10 md:px-14 lg:px-24 bg-gray-50">
          {/* <section className={'py-5 bg-white'}>
            <Row gutter={[16, 16]}>
              <Col
                xs={24}
                xl={18}
                className="flex flex-wrap place-items-center"
              >
                <div className="flex mx-auto ml-4 gap-10">
                  <div className="relative">
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Filter By Country"
                      optionFilterProp="children"
                      onChange={handleCountryChange}
                      value={selectedCountry}
                    >
                      {destination.map((des: any) => (
                        <Option key={des.id} value={des.id}>
                          {des.name}
                        </Option>
                      ))}
                    </Select>
                    {selectedCountry && (
                      <Button
                        type="text"
                        icon={<X />}
                        onClick={handleClearCountryFilter}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </section> */}
          <section className="flex flex-col gap-5 md:flex-row py-4 font-['Roboto'] leading-1.5 text-xl">
            <div className="w-full md:w-1/2">
              <div className=" flex flex-col gap-8 mx-auto md:flex-row md:flex-wrap">
                {paginatedUniversities.length > 0 ? (
                  paginatedUniversities.map((university) => (
                    <Link
                      key={university?.id}
                      href={`/university/details?uni=${university.slug}`}
                      className="text-decoration-none"
                    >
                      <div
                        key={university?.id}
                        className="bg-white border border-gray-500 h-auto flex flex-col p-4 md:p-6 rounded-md shadow-md"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-16 h-16 md:w-24 md:h-24 mr-4 rounded-full bg-gray-200 flex items-center justify-center">
                              <Image
                                src={renderImage({
                                  imgPath: university?.universityImage,
                                  size: 'lg',
                                })}
                                alt="Australian university"
                                className="object-cover"
                                height={400}
                                width={400}
                              />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold ">
                                {university?.universityName}
                              </h2>
                              <p className="text-gray-600 text-sm ">
                                {university?.destination?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2  text-base">
                            {university?.description.length >
                            maxLengthOfDescription
                              ? university?.description.substring(
                                  0,
                                  maxLengthOfDescription
                                ) + '...'
                              : university?.description}
                          </p>
                        </div>
                        {/* <Link
                          href={`/course/details/${university.courses[0].slug}/${university.slug}`}
                        >
                          <div>
                            <p className="flex text-center text-dark-blue font-bold text-base ">
                              <Eye /> View{' '}
                              {university.courses[0]?.subject.length} Subjects{' '}
                              {university.courses[0].courseName}{' '}
                              <ChevronRight className="h-5" />
                            </p>
                          </div>
                        </Link> */}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="bg-white flex mx-auto justify-center my-10">
                    <Empty
                      description={
                        <Typography.Text className="text-2xl">
                          No Universities found
                        </Typography.Text>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-5 w-full md:w-1/2">
              <div className="rounded-xl overflow-hidden w-full flex justify-center shadow-md flex flex-col justify-between h-full">
                <div className="flex-1">
                  <RegisterForm />
                </div>
              </div>
            </div>
          </section>
          <section className="py-4">
            <div className="container mx-auto mb-4 text-center mt-5 flex-end bg-white">
              <Pagination
                current={pagination.page}
                total={universityDetails.length}
                pageSize={pagination.limit}
                className="mx-auto container"
                onChange={handlePaginationChange}
              />
            </div>
          </section>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default CourseDetails;

import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Breadcrumb,
  Input,
  Button,
  Pagination,
  Empty,
  Select,
  Typography,
} from 'antd';
import { ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Heart } from 'lucide-react';
import { fetchUniversityByCourse } from '../../api/university';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';
import Link from 'next/link';
import Image from 'next/image';
import { renderImage } from 'libs/services/helper';
import RegisterForm from '../RegisterForm';

const { Option } = Select;

interface UniversityData {
  id: string;
  universityName: string;
  slug: string;
  description: string;
  universityImage: string;
  destination: {
    id: string;
    name: string;
  };
  courses: [
    {
      id: string;
      courseName: string;
      slug: string;
      subject: [
        {
          id: string;
          subjectName: string;
        }
      ];
    }
  ];
}

const Subject = ({ searchParams }: any) => {
  const maxLengthOfDescription = 400;
  const { subjectName } = searchParams;

  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [destination, setDestination] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: any = await fetchUniversityByCourse({ subjectName });
        setUniversities(response.data);
      } catch (error) {
        console.error('Failed to fetch university:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectName]);

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        const response = await fetchAllUniversityByDestination();
        setDestination(response);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      }
    };
    fetchDestinationData();
  }, []);

  useEffect(() => {
    const fetchUniversityByDestination = async () => {
      setLoading(true);
      try {
        const response = await fetchUniversityByCourse({
          subjectName,
          destination: selectedCountry,
        });
        setUniversities(response.data);
      } catch (error) {
        console.error('Failed to fetch courses by university:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversityByDestination();
  }, [selectedCountry]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const handleClearCountryFilter = () => {
    setSelectedCountry('');
  };

  const handlePaginationChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedUniversities = Array.isArray(universities)
    ? universities.slice(startIndex, endIndex)
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
              {universities.length} Universities offering {subjectName} courses
            </span>
          </div>
        </section>
        <div className="px-5 sm:px-10 md:px-14 lg:px-24 bg-gray-50">
          <section className={'py-5 bg-white'}>
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
          </section>
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
                        <Link
                          href={`/course/details?course=${university.courses[0].slug}`}
                        >
                          <div>
                            <p className="flex text-center text-dark-blue font-bold text-base ">
                              <Eye /> View{' '}
                              {university.courses[0]?.subject.length} Subjects{' '}
                              {university.courses[0].courseName}{' '}
                              <ChevronRight className="h-5" />
                            </p>
                          </div>
                        </Link>
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
                total={universities.length}
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

export default Subject;

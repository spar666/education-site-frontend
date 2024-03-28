'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Empty,
  Pagination,
  Breadcrumb,
  Input,
  Button,
  Select,
  Spin,
} from 'antd';
import ProgressiveImageLoading from 'apps/student/components/ProgressiveImage';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { X } from 'lucide-react';
import { fetchCourseByLevel } from '../../api/courses';
import { fetchAllUniversity } from '../../api/university';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';
import { fetchStudyLevels } from '../../api/studyLevel';

const { Option } = Select;

const Course = ({ searchParams }: any) => {
  const { degree } = searchParams;
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [destination, setDestination] = useState([]);
  const [level, setLevel] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(degree || '');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const response = await fetchCourseByLevel({ degree });
        setCourses(response);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [degree]);

  useEffect(() => {
    const fetchUniversityData = async () => {
      setLoading(true);
      try {
        const response = await fetchAllUniversity();
        setUniversities(response);
      } catch (error) {
        console.error('Failed to fetch universities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversityData();
  }, []);

  useEffect(() => {
    const fetchDestinationData = async () => {
      setLoading(true);
      try {
        const response = await fetchAllUniversityByDestination();
        setDestination(response);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinationData();
  }, []);

  useEffect(() => {
    const fetchStudyLevelData = async () => {
      setLoading(true);
      try {
        const response = await fetchStudyLevels();
        setLevel(response);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudyLevelData();
  }, []);

  useEffect(() => {
    const fetchCoursesByUniversity = async () => {
      setLoading(true);
      try {
        const response = await fetchCourseByLevel({
          degree,
          universityId: selectedUniversity,
        });
        setCourses(response);
      } catch (error) {
        console.error('Failed to fetch courses by university:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesByUniversity();
  }, [selectedUniversity, selectedLevel]);

  useEffect(() => {
    const fetchCoursesByCountry = async () => {
      setLoading(true);
      try {
        const response = await fetchCourseByLevel({
          degree,
          universityId: selectedUniversity,
          destination: selectedCountry,
        });
        setCourses(response);
      } catch (error) {
        console.error('Failed to fetch courses by university:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesByCountry();
  }, [selectedUniversity, selectedLevel, selectedCountry]);

  const handleUniversityChange = (value: string) => {
    setSelectedUniversity(value);
  };

  const handleClearUniversityFilter = () => {
    setSelectedUniversity('');
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  const handleClearCountryFilter = () => {
    setSelectedCountry('');
  };

  const handleClearLevelFilter = () => {
    setSelectedLevel('');
  };

  return (
    <section className="mx-auto">
      <MaxWidthWrapper>
        <section className={'py-5 bg-gray-50'}>
          <div className="container mx-auto my-3">
            <Breadcrumb separator={'>'}>
              <Breadcrumb.Item className="JT_breadcrumb cursor-pointer">
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item className="JT_breadcrumb JT_breadcrumb_last">
                All Undergraduate courses
              </Breadcrumb.Item>
            </Breadcrumb>
            <span className="text-sm text-muted-foreground hover:text-gray-600">
              All subject areas for Undergraduate courses. Explore the subject
              areas below to view related courses and find the course that’s
              right for you.
            </span>
          </div>
        </section>
        <div className="container bg-gray-50">
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
                  <div className="relative">
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Filter By Level"
                      optionFilterProp="children"
                      onChange={handleLevelChange}
                      value={selectedLevel}
                    >
                      {level.map((lvl: any) => (
                        <Option key={lvl.id} value={lvl.id}>
                          {lvl.name}
                        </Option>
                      ))}
                    </Select>
                    {selectedLevel && (
                      <Button
                        type="text"
                        icon={<X />}
                        onClick={handleClearLevelFilter}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                      />
                    )}
                  </div>
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Filter By University"
                    optionFilterProp="children"
                    onChange={handleUniversityChange}
                    value={selectedUniversity}
                  >
                    {universities.map((university: any) => (
                      <Option key={university.id} value={university.id}>
                        {university.universityName}
                      </Option>
                    ))}
                  </Select>
                  {selectedUniversity && (
                    <Button
                      type="text"
                      icon={<X />}
                      onClick={handleClearUniversityFilter}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2"
                    />
                  )}
                </div>
              </Col>
            </Row>
          </section>
          <section className="py-4">
            <Spin spinning={loading}>
              <Row
                className="JT_medium_spacing_bottom"
                gutter={loading ? [20, 20] : [16, 16]}
              >
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.slice(startIndex, endIndex).map((course: any) => (
                    <Col key={course?.id} xs={24} sm={12} xl={6}>
                      <div className="col test bg-black h-80 w-full overflow-hidden object-cover rounded-xl cursor-pointer">
                        <div className="image_overlay rounded-xl">
                          <ProgressiveImageLoading
                            srcImage={course?.countryImage}
                          />
                        </div>
                        <div className="absolute top-0 h-full w-full">
                          <div className="p-6">
                            <h1 className="text-xl text-black font-bold mb-6">
                              {course.courseName}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))
                ) : (
                  <div className="flex mx-auto justify-center my-10">
                    <Empty
                      description={
                        <Typography.Text className="text-2xl">
                          No courses found
                        </Typography.Text>
                      }
                    />
                  </div>
                )}
              </Row>
            </Spin>
          </section>
          <section className="py-4">
            <div className="container mx-auto mb-4 text-center mt-5 flex-end bg-white">
              <Pagination
                current={pagination.page}
                total={courses.length}
                pageSize={pagination.limit}
                className="mx-auto container"
                onChange={(page) => setPagination({ ...pagination, page })}
              />
            </div>
          </section>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default Course;

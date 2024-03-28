'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Row, Col, Select, Button, Input, Spin } from 'antd';
import { Award, DollarSign, Filter, TrendingUp, X } from 'lucide-react';

import { search } from '../../api/search';

const Search = ({ searchParams }: any) => {
  const { location, level, course } = searchParams;
  const [university, setUniversity] = useState([]);
  const [rankingOrder, setRankingOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [feesOrder, setFeesOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [scholarshipOrder, setScholarshipOrder] = useState<'yes' | 'no'>('no');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRankingOrderChange = async (value: 'ASC' | 'DESC') => {
    setRankingOrder(value);
    await fetchData();
  };

  const handleFeesOrderChange = async (value: 'ASC' | 'DESC') => {
    setFeesOrder(value);
    await fetchData();
  };

  const handleScholarshipOrderChange = async (value: 'yes' | 'no') => {
    setScholarshipOrder(value);
    await fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await search({
        course,
        level,
        location,
        rankingOrder,
        feesOrder,
        scholarshipOrder,
      });

      setUniversity(response);
      setError(null);
    } catch (error) {
      setError('Failed to fetch universities. Please try again.');
      console.error('Failed to fetch universities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [course, level, location]);

  return (
    <section className="mx-auto">
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {error}
        </div>
      )}
      <section className="container py-5 bg-gray-50 mx-auto">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={18}>
            <div className="flex  flex-wrap gap-4 mx-auto md:gap-6 font-bold justify-center md:justify-start">
              <Filter className="h-30 mt-1.5" />
              <div className="relative">
                <Input
                  prefix={<TrendingUp className="h-4 w-4 mr-2" />}
                  placeholder="Filter By Ranking"
                  className="rounded-md px-2 py-1 mr-2"
                  value={
                    rankingOrder === 'ASC'
                      ? 'Ranking: Low to High'
                      : 'Ranking: High to Low'
                  }
                  readOnly
                />
                <Select
                  defaultValue={rankingOrder}
                  onChange={handleRankingOrderChange}
                  className="absolute inset-0 opacity-0"
                >
                  <Select.Option value="ASC">
                    Ranking: Low to High
                  </Select.Option>
                  <Select.Option value="DESC">
                    Ranking: High to Low
                  </Select.Option>
                </Select>
              </div>
              <div className="relative">
                <Input
                  prefix={<DollarSign className="h-4 w-4 mr-2" />}
                  placeholder="Filter By Fees"
                  className="rounded-md px-2 py-1 mr-2"
                  value={
                    feesOrder === 'ASC'
                      ? 'Fees: Low to High'
                      : 'Fees: High to Low'
                  }
                  readOnly
                />
                <Select
                  defaultValue={feesOrder}
                  onChange={handleFeesOrderChange}
                  className="absolute inset-0 opacity-0"
                >
                  <Select.Option value="ASC">Fees: Low to High</Select.Option>
                  <Select.Option value="DESC">Fees: High to Low</Select.Option>
                </Select>
              </div>
              <div className="relative">
                <Input
                  prefix={<Award className="h-4 w-4 mr-2" />}
                  placeholder="Filter By Scholarship"
                  className="rounded-md px-2 py-1 mr-2"
                  value={
                    scholarshipOrder === 'yes'
                      ? 'Scholarship: yes'
                      : 'Scholarship: No'
                  }
                  readOnly
                />
                <Select
                  defaultValue={scholarshipOrder}
                  onChange={handleScholarshipOrderChange}
                  className="absolute inset-0 opacity-0"
                >
                  <Select.Option value="yes">Scholarship: yes</Select.Option>
                  <Select.Option value="no">Scholarship: no</Select.Option>
                </Select>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* University listing section */}
      <section className="py-4">
        <div className="bg-white w-full">
          <div className="bg-white flex flex-wrap gap-6 md:gap-6 justify-center md:justify-start mx-auto md:ml-10">
            {loading ? (
              <Spin size="large" />
            ) : university.length === 0 ? (
              <div className="text-center mt-4">
                <p>No universities found.</p>
              </div>
            ) : (
              <div className="bg-white w-full flex flex-wrap gap-6 md:gap-6 justify-center md:justify-start mx-auto md:ml-10">
                {university.map((uni: any) => (
                  <div
                    key={uni.id}
                    className="border border-gray-500 h-auto w-full md:w-1/3 lg:w-2/3 flex flex-col"
                  >
                    <div className="flex flex-row gap-4 md:gap-6 p-4 md:p-6">
                      <div className="flex items-center justify-center border border-gray-900 w-24 h-24 md:w-40 md:h-40">
                        {/* Render your university image here */}
                      </div>
                      <div className="flex flex-col flex-grow gap-3">
                        <span className="font-bold text-black text-lg md:text-xl">
                          {uni.universityName}
                        </span>
                        <span className="text-sm text-gray-900">
                          {uni?.destination?.name}
                        </span>
                        <span className="flex text-sm text-gray-900 gap-2">
                          <TrendingUp />
                          World Rank: {uni.worldRanking}
                        </span>
                        {uni.isEnglishCourseAvailable && (
                          <span className="border border-gray-500 rounded-full text-center border-medium text-black text-sm md:text-base p-1 md:p-2">
                            English courses available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Search;

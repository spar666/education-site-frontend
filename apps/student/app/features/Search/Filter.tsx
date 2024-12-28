'use client';

import { Button, Divider, Radio, Drawer, Spin, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { fetchStudyLevels } from '../../api/studyLevel';
import { fetchCourseCategories } from '../../api/courses';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';
import { fetchAllUniversity } from '../../api/university';

export interface FilterState {
  courseCategory: string;
  qualification: string;
  destination: string;
}

const SearchFilter = ({
  onFiltersChange,
}: {
  onFiltersChange: (filters: FilterState) => void;
}) => {
  const [filters, setFilters] = useState<FilterState>({
    courseCategory: '',
    qualification: '',
    destination: '',
  });
  const [data, setData] = useState<any>({
    courseCategory: [],
    studyLevel: [],
    destination: [],
    university: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [levels, courseCategories, destinations, universities] =
        await Promise.all([
          fetchStudyLevels(),
          fetchCourseCategories(),
          fetchAllUniversityByDestination(),
          fetchAllUniversity(),
        ]);
      setData({
        courseCategory: courseCategories,
        studyLevel: levels,
        destination: destinations,
        university: universities,
      });
    } catch (err: any) {
      setError('Failed to fetch filter data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    onFiltersChange({ ...filters, [key]: value });
  };

  const areFiltersApplied = Object.values(filters).some((value) => value);

  return (
    <div className="bg-white">
      {error && <Alert message={error} type="error" className="mb-4" />}
      {loading && <Spin tip="Loading filters..." className="w-full mb-4" />}

      {/* Mobile and Tablet Drawer Button */}
      <Button
        type="primary"
        onClick={() => setDrawerVisible(true)}
        className="block lg:hidden w-full mb-4"
      >
        Open Filters
      </Button>

      {/* Drawer for Mobile and Tablet Filters */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={300}
      >
        <FilterContent
          data={data}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <Button
          className="w-full mt-4"
          onClick={() =>
            setFilters({
              courseCategory: '',
              qualification: '',
              destination: '',
            })
          }
        >
          {areFiltersApplied ? 'Reset Filters' : 'Apply Filters'}
        </Button>
      </Drawer>

      {/* Desktop and Large Tablet Filters */}
      <div className="hidden md:block bg-white p-6 rounded-md">
        <FilterContent
          data={data}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

const FilterContent = ({ data, filters, onFilterChange }: any) => (
  <div className="w-full">
    {/* Course Category Filter */}
    <FilterGroup
      label="Course Category"
      options={data.courseCategory}
      selected={filters.courseCategory}
      onChange={(value: any) => onFilterChange('courseCategory', value)}
    />
    <Divider />

    {/* Study Level Filter */}
    <FilterGroup
      label="Qualification"
      options={data.studyLevel}
      selected={filters.qualification}
      onChange={(value: any) => onFilterChange('qualification', value)}
    />
    <Divider />

    {/* Destination Filter */}
    <FilterGroup
      label="Destination"
      options={data.destination}
      selected={filters.destination}
      onChange={(value: any) => onFilterChange('destination', value)}
    />
  </div>
);

const FilterGroup = ({ label, options, selected, onChange }: any) => (
  <div>
    <label className="font-bold text-lg text-gray-700">{label}</label>
    <Radio.Group
      className="flex flex-col gap-2 pt-2"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option: any) => (
        <Radio key={option.id} value={option.id} className="text-gray-600">
          {option.name || option.courseCategory}
        </Radio>
      ))}
    </Radio.Group>
  </div>
);

export default SearchFilter;

'use client';

import React, { useEffect, useState } from 'react';
import {
  Globe,
  GraduationCap,
  Star,
  Search as SearchIcon,
  X,
} from 'lucide-react';
import { Button, Drawer, Spin, Alert, Badge } from 'antd';
import { fetchStudyLevels } from '../../api/studyLevel';
import { fetchCourseCategories } from '../../api/courses';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';
import { fetchAllUniversity } from '../../api/university';

interface FilterOption {
  id: string;
  name: string;
  courseCategory?: string; // Only for course categories
}

interface FilterData {
  courseCategory: FilterOption[];
  studyLevel: FilterOption[];
  destination: FilterOption[];
  university: FilterOption[];
}

interface FilterState {
  courseCategory: string;
  qualification: string;
  destination: string;
}

interface SearchFilterProps {
  onFiltersChange: (filters: FilterState) => void;
}

const SearchFilter: React.FC<any> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    courseCategory: '',
    qualification: '',
    destination: '',
  });

  const [data, setData] = useState<FilterData>({
    courseCategory: [],
    studyLevel: [],
    destination: [],
    university: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Count active filters for badge
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const fetchFilterData = async () => {
    try {
      const [studyLevels, courseCategories, destinations, universities] =
        await Promise.all([
          fetchStudyLevels(),
          fetchCourseCategories(),
          fetchAllUniversityByDestination(),
          fetchAllUniversity(),
        ]);

      console.log(courseCategories, 'courseCategories');

      setData({
        courseCategory: courseCategories,
        studyLevel: studyLevels,
        destination: destinations,
        university: universities,
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load filter options. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const resetState = {
      courseCategory: '',
      qualification: '',
      destination: '',
    };
    setFilters(resetState);
    onFiltersChange(resetState);
  };

  const renderSelect = (
    name: keyof FilterState,
    label: string,
    options: FilterOption[],
    icon: React.ReactNode
  ) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="flex items-center text-gray-700 font-medium mb-2"
      >
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <select
        id={name}
        name={name}
        value={filters[name]}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
        disabled={loading}
      >
        <option value="">All {label}s</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-4">
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          className="mb-4"
        />
      )}

      {renderSelect(
        'destination',
        'Destination',
        data.destination,
        <Globe className="h-4 w-4 text-blue-600" />
      )}

      {renderSelect(
        'courseCategory',
        'Category',
        data.courseCategory,
        <GraduationCap className="h-4 w-4 text-blue-600" />
      )}

      {renderSelect(
        'qualification',
        'Qualification',
        data.studyLevel,
        <Star className="h-4 w-4 text-blue-600" />
      )}

      <div className="flex space-x-3 pt-3 border-t border-gray-200">
        <button
          onClick={resetFilters}
          disabled={loading || activeFilterCount === 0}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center border ${
            activeFilterCount === 0
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
          }`}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </button>

        <button
          onClick={() => setDrawerVisible(false)}
          className="lg:hidden flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Show Results
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Mobile Filter Button */}
      <Button
        type="default"
        onClick={() => setDrawerVisible(true)}
        className="lg:hidden w-full mb-4 flex items-center justify-between"
      >
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge count={activeFilterCount} className="ml-2" />
        )}
      </Button>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span>Filters</span>
            {activeFilterCount > 0 && <Badge count={activeFilterCount} />}
          </div>
        }
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={320}
        closable={true}
        className="lg:hidden"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin tip="Loading filters..." />
          </div>
        ) : (
          <FilterContent />
        )}
      </Drawer>

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin tip="Loading filters..." />
          </div>
        ) : (
          <FilterContent />
        )}
      </div>
    </div>
  );
};

export default SearchFilter;

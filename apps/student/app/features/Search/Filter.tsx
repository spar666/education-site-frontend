'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Globe, GraduationCap, Star, X } from 'lucide-react';
import { Button, Drawer, Spin, Alert, Badge } from 'antd';
import { fetchStudyLevels } from '../../api/studyLevel';
import { fetchCourseCategories } from '../../api/courses';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';
import { fetchAllUniversity } from '../../api/university';

interface FilterOption {
  id: string;
  name: string;
  slug?: string;
}

interface FilterData {
  courseCategories: FilterOption[];
  studyLevels: FilterOption[];
  destinations: FilterOption[];
  universities: FilterOption[];
}

interface FilterState {
  courseCategory: string;
  qualification: string;
  destination: string;
}

interface SearchFilterProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

const SearchFilter: React.FC<any> = ({
  onFiltersChange,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<FilterState>({
    courseCategory: '',
    qualification: '',
    destination: '',
    ...initialFilters,
  });

  const [data, setData] = useState<FilterData>({
    courseCategories: [],
    studyLevels: [],
    destinations: [],
    universities: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const fetchFilterData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [studyLevels, courseCategories, destinations, universities] =
        await Promise.all([
          fetchStudyLevels(),
          fetchCourseCategories(),
          fetchAllUniversityByDestination(),
          fetchAllUniversity(),
        ]);

      setData({
        courseCategories,
        studyLevels,
        destinations,
        universities,
      });
    } catch (err) {
      console.error('Failed to load filters:', err);
      setError('Failed to load filter options. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  const handleFilterChange = useCallback(
    (name: keyof FilterState, value: string) => {
      console.log('=== Filter Changed ===');
      console.log('Filter name:', name);
      console.log('Filter value:', value);
      
      const newFilters = { ...filters, [name]: value };
      console.log('New filters state:', newFilters);
      
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const resetFilters = useCallback(() => {
    const resetState = {
      courseCategory: '',
      qualification: '',
      destination: '',
    };
    setFilters(resetState);
    onFiltersChange(resetState);
  }, [onFiltersChange]);

  const renderSelect = (
    name: keyof FilterState,
    label: string,
    options: FilterOption[],
    icon: React.ReactNode
  ) => (
    <div className="mb-4">
      <label className="flex items-center text-gray-700 font-medium mb-2">
        <span className="mr-2">{icon}</span>
        {label}
      </label>
      <select
        name={name}
        value={filters[name]}
        onChange={(e) => handleFilterChange(name, e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
        disabled={loading}
      >
        <option value="">All {label}</option>
        {options.map((item) => (
          <option key={item.id} value={item.slug || item.id}>
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
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      {renderSelect(
        'destination',
        'Destinations',
        data.destinations,
        <Globe className="h-4 w-4 text-blue-600" />
      )}

      {renderSelect(
        'courseCategory',
        'Categories',
        data.courseCategories,
        <GraduationCap className="h-4 w-4 text-blue-600" />
      )}

      {renderSelect(
        'qualification',
        'Qualifications',
        data.studyLevels,
        <Star className="h-4 w-4 text-blue-600" />
      )}

      <div className="flex space-x-3 pt-3 border-t border-gray-200">
        <Button
          onClick={resetFilters}
          disabled={loading || activeFilterCount === 0}
          className={`flex-1 ${
            activeFilterCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          icon={<X size={16} />}
        >
          Clear All
        </Button>

        <Button
          type="primary"
          onClick={() => setDrawerVisible(false)}
          className="lg:hidden flex-1"
        >
          Show Results
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Mobile Filter Trigger */}
      <Button
        type="default"
        onClick={() => setDrawerVisible(true)}
        className="lg:hidden w-full mb-4 flex items-center justify-between"
      >
        <span>Filters</span>
        {activeFilterCount > 0 && <Badge count={activeFilterCount} />}
      </Button>

      {/* Mobile Filter Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span>Filters</span>
            {activeFilterCount > 0 && <Badge count={activeFilterCount} />}
          </div>
        }
        placement="left"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={320}
        closable
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

      {/* Desktop Filter Panel */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Button type="link" onClick={resetFilters} className="p-0">
              Clear all
            </Button>
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

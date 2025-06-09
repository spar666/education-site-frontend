'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, Select, Space, Table, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  DeleteOutlined,
  EditTwoTone,
  FilterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import {
  deleteCourse,
  fetchCourseCategories,
  fetchCourses,
} from 'apps/admin/app/api/Course';
import { fetchStudyLevels } from 'apps/admin/app/api/studylevel';
import debounce from 'lodash/debounce';

const { Option } = Select;

// Define the Course interface
interface Course {
  id: string;
  courseName: string;
  level: string;
  category: string;
}

interface Filters {
  level?: string;
  category?: string;
}

const ActionColumn = ({
  id,
  onDelete,
}: {
  id: string;
  onDelete: (id: string) => void;
}) => (
  <Space size="middle">
    <Link href={`/course/edit?id=${id}`} passHref>
      <Button
        type="text"
        icon={
          <EditTwoTone
            className="text-lg"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        }
        className="hover:bg-blue-50 transition-colors rounded-lg h-8 w-8 flex items-center justify-center border-0"
      />
    </Link>
    <Button
      type="text"
      icon={
        <DeleteOutlined
          className="text-lg text-red-500"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      }
      onClick={() => onDelete(id)}
      className="hover:bg-red-50 transition-colors rounded-lg h-8 w-8 flex items-center justify-center border-0"
    />
  </Space>
);

function CourseList() {
  const router = useRouter();
  const [course, setCourse] = useState<Course[]>([]);
  const [level, setLevel] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    fetchAllCourses(); // Initial fetch when component mounts
  }, []);

  const fetchAllCourses = async (filters: Filters = {}) => {
    setLoading(true);
    try {
      const [coursesResponse, levelsResponse, categoriesResponse] =
        await Promise.all([
          fetchCourses(filters), // Pass filters here to fetch filtered courses
          fetchStudyLevels(),
          fetchCourseCategories(),
        ]);

      setLevel(levelsResponse);
      setCategory(categoriesResponse);

      // Set filtered courses after fetching based on the current filters
      setCourse(coursesResponse);
      setFilteredCourses(coursesResponse); // Make sure to update the filteredCourses state
    } catch (error) {
      console.error('Error fetching data:', error);
      notification.error({ message: 'Failed to fetch courses.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setCourseToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(courseToDelete);
      setDeleteModalVisible(false);
      notification.success({ message: 'Course deleted successfully' });

      // Refetch courses after deletion
      fetchAllCourses(filters);
    } catch (error) {
      console.error('Error deleting course:', error);
      notification.error({ message: 'Failed to delete course.' });
    }
  };

  // Debounced filter change handler
  const debouncedFilterChange = useCallback(
    debounce((updatedFilters: Filters) => {
      fetchAllCourses(updatedFilters); // Fetch filtered courses after debounce
    }, 500), // 500ms debounce time
    []
  );

  const handleFilterChange = (key: keyof Filters, value?: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    debouncedFilterChange(updatedFilters); // Call debounced function
  };

  const resetFilters = () => {
    setFilters({});
    fetchAllCourses(); // Fetch all courses when filters are reset
  };

  const columns: ColumnsType<Course> = [
    {
      title: () => <span className="text-base font-semibold">Course Name</span>,
      dataIndex: 'courseName',
      key: 'courseName',
      width: '80%',
      render: (text) => (
        <div className="py-4 pl-4">
          <span className="text-base font-medium text-gray-800 hover:text-blue-600 cursor-pointer transition-colors">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: () => <span className="text-base font-semibold">Action</span>,
      key: 'action',
      align: 'center',
      width: '20%',
      render: (_, record) => (
        <div className="py-2">
          <ActionColumn id={record.id} onDelete={handleDelete} />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Course">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Course Management
                </h3>
                <p className="text-gray-500 mt-1">
                  Manage and organize your courses
                </p>
              </div>
              <Button
                type="primary"
                onClick={() => router.push('/course/create')}
                size="large"
                icon={
                  <PlusOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
                className="bg-dark-navy  hover:bg-blue-700 text-white h-10 flex items-center gap-2"
              >
                Add New Course
              </Button>
            </div>

            {/* Filters Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FilterOutlined
                    className="text-lg"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <span className="font-medium">Filters:</span>
                </div>
                <Select
                  placeholder="Filter by Level"
                  allowClear
                  style={{ width: 200 }}
                  value={filters.level}
                  onChange={(value) => handleFilterChange('level', value)}
                  className="hover:border-blue-400"
                >
                  {level.map((lev) => (
                    <Option key={lev.id} value={lev.id}>
                      {lev.name}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Filter by Category"
                  allowClear
                  style={{ width: 200 }}
                  value={filters.category}
                  onChange={(value) => handleFilterChange('category', value)}
                  className="hover:border-blue-400"
                >
                  {category.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.courseCategory}
                    </Option>
                  ))}
                </Select>

                <Button
                  onClick={resetFilters}
                  className="text-gray-600 hover:text-blue-600 hover:border-blue-600"
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Table Section */}
            <Table
              loading={loading}
              columns={columns}
              dataSource={filteredCourses}
              rowKey="id"
              className="custom-table"
              pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
                showSizeChanger: false,
                className: 'pagination-custom',
              }}
            />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        title={<span className="text-xl font-semibold">Confirm Delete</span>}
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={confirmDelete}
        okText="Delete"
        okButtonProps={{
          style: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
          className: 'hover:bg-red-700',
        }}
        className="confirm-modal"
      >
        <p className="text-gray-600 my-4">
          Are you sure you want to delete this course? This action cannot be
          undone.
        </p>
      </Modal>
    </AdminLayout>
  );
}

export default CourseList;

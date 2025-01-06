'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, Select, Space, Table, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, EditTwoTone, FilterOutlined } from '@ant-design/icons';
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
      <EditTwoTone
        className="text-2xl"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    </Link>
    <DeleteOutlined
      className="text-2xl text-red-500"
      onClick={() => onDelete(id)}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
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
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <ActionColumn id={record.id} onDelete={handleDelete} />
      ),
    },
  ];

  return (
    <AdminLayout title="Course">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Courses</h3>
        <Button
          type="primary"
          onClick={() => router.push('/course/create')}
          size="large"
        >
          Add New Course
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <FilterOutlined
          size={70}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <Select
          placeholder="Filter by Level"
          allowClear
          style={{ width: 200 }}
          value={filters.level}
          onChange={(value) => handleFilterChange('level', value)}
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
        >
          {category.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.courseCategory}
            </Option>
          ))}
        </Select>

        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredCourses}
        rowKey="id"
      />

      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={confirmDelete}
        okText="Delete"
        okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
      >
        <p>Are you sure you want to delete this course?</p>
      </Modal>
    </AdminLayout>
  );
}

export default CourseList;

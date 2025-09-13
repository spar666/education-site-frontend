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
import { AIPopup } from '../../../../components/AgentInput';

const { Option } = Select;

const AIAgentIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="32"
      cy="32"
      r="30"
      fill="#F9FAFB"
      stroke="#4F46E5"
      strokeWidth="3"
    />
    <circle cx="32" cy="22" r="8" fill="#4F46E5" />
    <path d="M22 42c0-5.5 4.5-10 10-10s10 4.5 10 10v6H22v-6z" fill="#4F46E5" />
    <circle cx="26" cy="16" r="1.5" fill="white" />
    <circle cx="38" cy="16" r="1.5" fill="white" />
    <circle cx="32" cy="12" r="1.5" fill="white" />
    <path
      d="M44 36c2 0 4 2 4 4s-2 4-4 4h-4v-3"
      stroke="#4F46E5"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="22"
      x2="24"
      y2="22"
      stroke="#6366F1"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="14" cy="22" r="2" fill="#6366F1" />
    <line
      x1="40"
      y1="22"
      x2="50"
      y2="22"
      stroke="#6366F1"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="50" cy="22" r="2" fill="#6366F1" />
  </svg>
);

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
  const [aiPopupVisible, setAiPopupVisible] = useState(false);

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

  const handleAISubmit = (prompt: string) => {
    console.log('AI Prompt for Course:', prompt);
    setAiPopupVisible(false);
    notification.info({
      message: 'AI Course Generation',
      description:
        'Your course is being generated. You will be redirected shortly...',
    });

    // In a real app, you might redirect to a creation page with the prompt
    // router.push(`/course/create?aiPrompt=${encodeURIComponent(prompt)}`);
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
      {/* AI Popup Modal */}
      <AIPopup
        visible={aiPopupVisible}
        onClose={() => setAiPopupVisible(false)}
        onSubmit={handleAISubmit}
        title="AI Course Creator"
        description="Describe the course you want to create. Our AI agent will research the web and generate a comprehensive course structure with up-to-date information."
        placeholder="e.g., 'universities in australia'"
      />
    </AdminLayout>
  );
}

export default CourseList;

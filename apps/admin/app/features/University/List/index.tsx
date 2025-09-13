'use client';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Switch,
  Table,
  notification,
  Modal,
  Checkbox,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  DeleteOutlined,
  EditTwoTone,
  QuestionCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import {
  fetchUniversity,
  updateUniversityStatus,
  deleteUniversity,
  generateUniversityWithAI,
  enrichDataWithAI,
} from 'apps/admin/app/api/University';

// Types
interface University {
  id: string;
  universityName: string;
  isActive: boolean;
  key?: string;
}

interface EnrichmentParams {
  destination: string;
  courseCategory: string;
  studyLevel: string;
  limit: number;
  includeCourses: boolean;
  includeCategories: boolean;
}

type AIMode = 'single' | 'bulk';

// Constants
const DEFAULT_ENRICHMENT_PARAMS: EnrichmentParams = {
  destination: 'Australia',
  courseCategory: '',
  studyLevel: '',
  limit: 50,
  includeCourses: true,
  includeCategories: true,
};

const SEARCH_DEBOUNCE_MS = 300;
const TABLE_PAGE_SIZE = 10;

// AI Agent Icon Component
const AIAgentIcon: React.FC = () => (
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

// Action Column Component
interface ActionColumnProps {
  id: string;
  onDelete: (id: string) => Promise<void>;
}

const ActionColumn: React.FC<ActionColumnProps> = ({ id, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } catch (error: any) {
      notification.error({
        message: 'Unable to delete',
        description:
          error.message ||
          'This item cannot be deleted because it is referenced by other records.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Space size={[16, 16]}>
      <div className="flex gap-5 items-center">
        <Link href={`/university/edit?id=${id}`} passHref>
          <EditTwoTone
            className="text-2xl cursor-pointer hover:text-blue-600 transition-colors"
            
            
          />
        </Link>

        <Popconfirm
          title="Are you sure you want to delete this university?"
          description="This action cannot be undone."
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ loading: isDeleting }}
        >
          <DeleteOutlined
            className="text-2xl text-red-500 mt-[-12px] cursor-pointer hover:text-red-700 transition-colors"
            
            
          />
        </Popconfirm>
      </div>
    </Space>
  );
};

// Active Column Component
interface ActiveColumnProps {
  id: string;
  isActive: boolean;
  onActiveToggle: (id: string) => void;
  isUpdating?: boolean;
}

const ActiveColumn: React.FC<ActiveColumnProps> = ({
  id,
  isActive,
  onActiveToggle,
  isUpdating = false,
}) => (
  <Popconfirm
    title={`Are you sure you want to ${
      isActive ? 'unpublish' : 'publish'
    } this university?`}
    icon={
      <QuestionCircleOutlined
        style={{ color: 'red' }}
        
        
      />
    }
    onConfirm={() => onActiveToggle(id)}
    okText="Yes"
    cancelText="No"
    disabled={isUpdating}
  >
    <Space size="middle">
      <Switch
        checked={isActive}
        loading={isUpdating}
        disabled={isUpdating}
        style={{ backgroundColor: isActive ? '#53C31B' : undefined }}
        id="publishSwitch"
      />
    </Space>
  </Popconfirm>
);

// Example Prompts Component
interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelectPrompt }) => {
  const examples = [
    "Create a public university named 'State University of Technology' in Austin, Texas, focusing on engineering, computer science, and renewable energy research.",
    "Design a private liberal arts college called 'Harmony College' in Portland, Oregon, with programs in arts, humanities, environmental studies, and social sciences.",
  ];

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Example Prompts:
      </h4>
      <div className="space-y-2">
        {examples.map((example, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-sm text-gray-600"
            onClick={() => onSelectPrompt(example)}
          >
            "{example}"
          </div>
        ))}
      </div>
    </div>
  );
};

// Bulk Enrichment Form Component
interface BulkEnrichmentFormProps {
  params: EnrichmentParams;
  onParamsChange: (params: EnrichmentParams) => void;
}

const BulkEnrichmentForm: React.FC<BulkEnrichmentFormProps> = ({
  params,
  onParamsChange,
}) => {
  const handleChange = (field: keyof EnrichmentParams, value: any) => {
    onParamsChange({ ...params, [field]: value });
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Bulk Data Enrichment
        </h3>
        <p className="text-gray-600 text-sm">
          Generate multiple universities, courses, and categories for a specific
          destination using AI.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <Input
            placeholder="e.g., Australia, United States, Canada"
            value={params.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Universities
          </label>
          <Input
            type="number"
            placeholder="50"
            value={params.limit}
            onChange={(e) =>
              handleChange('limit', parseInt(e.target.value) || 50)
            }
            min={1}
            max={500}
            className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Category (Optional)
          </label>
          <Input
            placeholder="e.g., Engineering, Business, Arts"
            value={params.courseCategory}
            onChange={(e) => handleChange('courseCategory', e.target.value)}
            className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Study Level (Optional)
          </label>
          <Input
            placeholder="e.g., Undergraduate, Postgraduate"
            value={params.studyLevel}
            onChange={(e) => handleChange('studyLevel', e.target.value)}
            className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={params.includeCourses}
            onChange={(e) => handleChange('includeCourses', e.target.checked)}
          >
            <span className="text-sm text-gray-700">Include Courses</span>
          </Checkbox>
          <Checkbox
            checked={params.includeCategories}
            onChange={(e) =>
              handleChange('includeCategories', e.target.checked)
            }
          >
            <span className="text-sm text-gray-700">Include Categories</span>
          </Checkbox>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Example Request:
        </h4>
        <div className="text-xs text-blue-800 font-mono bg-blue-100 p-3 rounded">
          {`curl -X 'POST' 'http://localhost:3001/api/ai-enrichment/enrich' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "destination": "${params.destination}",
  "courseCategory": "${params.courseCategory || 'Engineering'}",
  "studyLevel": "${params.studyLevel || 'Undergraduate'}",
  "limit": ${params.limit},
  "includeCourses": ${params.includeCourses},
  "includeCategories": ${params.includeCategories}
}'`}
        </div>
      </div>
    </div>
  );
};

// Main Component
const UniversityList: React.FC = () => {
  const router = useRouter();

  // State management
  const [originalData, setOriginalData] = useState<University[]>([]);
  const [filteredData, setFilteredData] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPopupVisible, setAiPopupVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>('single');
  const [enrichmentParams, setEnrichmentParams] = useState<EnrichmentParams>(
    DEFAULT_ENRICHMENT_PARAMS
  );

  // Memoized filtered data
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return originalData;

    return originalData.filter((uni: University) =>
      uni.universityName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [originalData, searchQuery]);

  // Update filtered data when search changes
  useEffect(() => {
    setFilteredData(filteredUniversities);
  }, [filteredUniversities]);

  // Fetch universities
  const fetchAllUniversities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUniversity();
      const universitiesWithKeys = response.map((uni: University) => ({
        ...uni,
        key: uni.id,
      }));
      setOriginalData(universitiesWithKeys);
      setFilteredData(universitiesWithKeys);
    } catch (error) {
      console.error('Error fetching data:', error);
      notification.error({
        message: 'Failed to fetch universities',
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUniversities();
  }, [fetchAllUniversities]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setSearchQuery(searchValue);
    }, SEARCH_DEBOUNCE_MS),
    []
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle delete
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await deleteUniversity(id);

        if (response?.status >= 200 && response?.status < 300) {
          notification.success({
            message: 'University deleted successfully!',
          });
          await fetchAllUniversities();
        } else {
          throw new Error(
            response?.data?.message ||
              `HTTP ${response?.status}: Failed to delete university`
          );
        }
      } catch (error: any) {
        console.error('Delete Error:', error);
        throw new Error(error.message || 'Failed to delete university');
      }
    },
    [fetchAllUniversities]
  );

  // Handle AI generation
  const handleAiGeneration = useCallback(async () => {
    if (aiMode === 'single' && !aiPrompt.trim()) {
      notification.warning({
        message: 'Please enter a prompt',
        description: 'Describe the university you want to create',
      });
      return;
    }

    if (aiMode === 'bulk' && !enrichmentParams.destination.trim()) {
      notification.warning({
        message: 'Please enter a destination',
        description: 'Destination is required for bulk enrichment',
      });
      return;
    }

    setIsGenerating(true);
    try {
      if (aiMode === 'single') {
        const response = await generateUniversityWithAI(aiPrompt);

        // Debug logging
        console.log('AI Generation Response:', {
          status: response?.status,
          data: response?.data,
          success: response?.data?.success,
        });

        // Check if the response is successful (status 200-299)
        if (response?.status >= 200 && response?.status < 300) {
          // Check if the operation was actually successful
          if (response.data?.success === true) {
            notification.success({
              message: 'University Generated Successfully!',
              description:
                'The university has been created with AI-generated data.',
            });
            setAiPrompt('');
            setAiPopupVisible(false);
            await fetchAllUniversities();
          } else {
            // API returned success status but operation failed
            throw new Error(
              response?.data?.message || 'Failed to generate university'
            );
          }
        } else {
          // HTTP error status
          throw new Error(
            response?.data?.message ||
              `HTTP ${response?.status}: Failed to generate university`
          );
        }
      } else {
        const response = await enrichDataWithAI(enrichmentParams);

        // Debug logging
        console.log('Bulk Enrichment Response:', {
          status: response?.status,
          data: response?.data,
          success: response?.data?.success,
        });

        // Check if the response is successful (status 200-299)
        if (response?.status >= 200 && response?.status < 300) {
          // Check if the operation was actually successful
          if (response.data?.success === true) {
            const summary = response.data.summary;
            notification.success({
              message: 'Bulk Enrichment Completed!',
              description: `Created ${
                summary?.totalUniversities || 0
              } universities, ${summary?.totalCourses || 0} courses, and ${
                summary?.totalCategories || 0
              } categories.`,
            });
            setEnrichmentParams(DEFAULT_ENRICHMENT_PARAMS);
            setAiPopupVisible(false);
            await fetchAllUniversities();
          } else {
            // API returned success status but operation failed
            throw new Error(response?.data?.message || 'Failed to enrich data');
          }
        } else {
          // HTTP error status
          throw new Error(
            response?.data?.message ||
              `HTTP ${response?.status}: Failed to enrich data`
          );
        }
      }
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      notification.error({
        message: 'AI Generation Failed',
        description: error.message || 'Failed to generate university with AI',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [aiMode, aiPrompt, enrichmentParams, fetchAllUniversities]);

  // Handle status toggle
  const handleStatusToggle = async (id: string) => {
    if (updatingStatus === id) return;

    setUpdatingStatus(id);
    try {
      const response = await updateUniversityStatus(id);

      if (response?.status >= 200 && response?.status < 300) {
        notification.success({
          message: response.data?.message || 'Status updated successfully',
        });

        // Update local state
        const updateData = (data: University[]) =>
          data.map((uni) =>
            uni.id === id ? { ...uni, isActive: !uni.isActive } : uni
          );

        setFilteredData(updateData);
        setOriginalData(updateData);
      } else {
        throw new Error(
          response?.data?.message ||
            `HTTP ${response?.status}: Failed to update status`
        );
      }
    } catch (error: any) {
      console.error('Status Update Error:', error);
      notification.error({
        message: 'Status Update Failed',
        description: error.message || 'Failed to update status',
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Reset AI modal
  const resetAIModal = useCallback(() => {
    setAiPopupVisible(false);
    setAiPrompt('');
    setAiMode('single');
    setEnrichmentParams(DEFAULT_ENRICHMENT_PARAMS);
  }, []);

  // Table columns
  const columns: ColumnsType<University> = useMemo(
    () => [
      {
        title: () => <span className="text-base font-semibold">Name</span>,
        dataIndex: 'universityName',
        key: 'universityName',
        render: (text) => (
          <div className="py-4 pl-4">
            <span className="text-base font-medium text-gray-800 hover:text-blue-600 cursor-pointer transition-colors">
              {text}
            </span>
          </div>
        ),
      },
      {
        title: () => <span className="text-base font-semibold">Published</span>,
        dataIndex: 'isActive',
        key: 'isActive',
        align: 'center',
        width: '200px',
        sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
        render: (text, record) => (
          <div className="py-4">
            <ActiveColumn
              id={record.id}
              isActive={record.isActive}
              onActiveToggle={handleStatusToggle}
              isUpdating={updatingStatus === record.id}
            />
          </div>
        ),
      },
      {
        title: () => <span className="text-base font-semibold">Action</span>,
        key: 'action',
        align: 'center',
        width: '150px',
        render: (text, record) => (
          <div className="py-4">
            <ActionColumn id={record.id} onDelete={handleDelete} />
          </div>
        ),
      },
    ],
    [updatingStatus, handleStatusToggle, handleDelete]
  );

  return (
    <AdminLayout title="University">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Universities
                </h3>
                <p className="text-gray-500 mt-1">
                  Manage and organize your university listings
                </p>
              </div>

              <div className="flex gap-3">
                

                <Button
                  type="primary"
                  onClick={() => router.push('/university/create')}
                  size="large"
                  className="bg-dark-navy hover:bg-blue-700 text-white h-10 flex items-center gap-2 px-4"
                  icon={
                    <PlusOutlined
                      
                      
                    />
                  }
                >
                  Add New University
                </Button>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-gray-50/50 p-5 rounded-xl mb-8 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Search universities..."
                    prefix={
                      <SearchOutlined
                        className="text-gray-400"
                        style={{
                          fontSize: '16px',
                          lineHeight: '1',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        
                        
                      />
                    }
                    onChange={handleSearchChange}
                    className="h-11 rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors shadow-sm"
                    style={{
                      fontSize: '0.95rem',
                      paddingTop: '0',
                      paddingBottom: '0',
                    }}
                  />
                  {searchQuery && (
                    <div className="absolute top-1/2 transform -translate-y-1/2 right-3 text-xs text-gray-400 pointer-events-none">
                      {filteredData.length} results
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table Section */}
            <Table
              loading={loading}
              scroll={{ x: true }}
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              className="custom-table"
              pagination={{
                pageSize: TABLE_PAGE_SIZE,
                hideOnSinglePage: true,
                showSizeChanger: false,
                total: filteredData.length,
                className: 'pagination-custom',
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} universities`,
              }}
              onChange={(pagination) => {
                router.push(
                  `/university?page=${pagination.current}`,
                  undefined
                );
              }}
            />
          </div>
        </div>

        {/* AI Popup Modal */}
        <Modal
          title="AI University Management"
          open={aiPopupVisible}
          onCancel={resetAIModal}
          footer={null}
          width={700}
        >
          <div className="p-6">
            {/* Mode Selection */}
            <div className="mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    aiMode === 'single'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setAiMode('single')}
                >
                  Single University
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    aiMode === 'bulk'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setAiMode('bulk')}
                >
                  Bulk Enrichment
                </button>
              </div>
            </div>

            {aiMode === 'single' ? (
              // Single University Creation
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Create Single University
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Describe the university you want to create. Be specific
                    about the name, location, and any special features.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University Description
                  </label>
                  <Input.TextArea
                    placeholder="e.g., Create a university named 'Tech Innovation University' located in San Francisco, California. It should be a private research university specializing in computer science, engineering, and business programs."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={6}
                    className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                    maxLength={1000}
                    showCount
                  />
                </div>

                <ExamplePrompts onSelectPrompt={setAiPrompt} />
              </div>
            ) : (
              // Bulk Enrichment
              <BulkEnrichmentForm
                params={enrichmentParams}
                onParamsChange={setEnrichmentParams}
              />
            )}

            <div className="flex gap-3 justify-end">
              <Button onClick={resetAIModal}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleAiGeneration}
                loading={isGenerating}
                disabled={
                  aiMode === 'single'
                    ? !aiPrompt.trim()
                    : !enrichmentParams.destination.trim()
                }
                className="bg-dark-navy hover:bg-blue-700 text-white"
              >
                {isGenerating
                  ? 'Processing...'
                  : aiMode === 'single'
                  ? 'Generate University'
                  : 'Start Bulk Enrichment'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UniversityList;

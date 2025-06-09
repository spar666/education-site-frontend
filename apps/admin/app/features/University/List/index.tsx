'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Switch,
  Table,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  DeleteOutlined,
  EditTwoTone,
  QuestionCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import {
  fetchUniversity,
  updateUniversityStatus,
  deleteUniversity, // Assuming you have this delete function
} from 'apps/admin/app/api/University';
import { debounce } from 'lodash';

const ActionColumn = ({ id, onDelete }: any) => (
  <>
    <Space size={[16, 16]} className="test">
      <div className="flex gap-5 items-center">
        <Link href={`/university/edit?id=${id}`} passHref>
          <EditTwoTone
            className="text-2xl"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </Link>

        <DeleteOutlined
          className="text-2xl text-red-500 mt-[-12px]"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onClick={() => {
            onDelete(id).catch((error: any) => {
              // Show notification if delete fails due to dependency
              notification.error({
                message: 'Unable to delete',
                description:
                  'This item cannot be deleted because it is referenced by other records.',
              });
            });
          }}
        />
      </div>
    </Space>
  </>
);

function UniversityList() {
  const router = useRouter();
  const [originalData, setOriginalData] = useState([]); // Store original data
  const [university, setUniversity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchAllUniversities() {
      setLoading(true);
      try {
        const response = await fetchUniversity();
        setOriginalData(response); // Store original data
        setUniversity(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({
          message: 'Failed to fetch universities',
          description: 'Please try again later',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAllUniversities();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      if (!searchValue.trim()) {
        setUniversity(originalData);
        return;
      }

      const filtered = originalData.filter((uni: any) =>
        uni.universityName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setUniversity(filtered);
    }, 300),
    [originalData]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleDelete = async (id: string) => {
    try {
      // Call your delete API (make sure it throws an error on failure)
      const response = await deleteUniversity(id);
      if (response.status === 200) {
        notification.success({
          message: 'University deleted successfully!',
        });
        // Optionally reload data
        fetchUniversity();
      } else {
        throw new Error('Unable to delete');
      }
    } catch (error) {
      throw new Error('Failed to delete due to dependency');
    }
  };

  const ActiveColumn = ({
    id,
    isActive,
    onActiveToggle,
  }: {
    id: string;
    isActive: boolean;
    onActiveToggle: (id: any) => void;
  }) => {
    return (
      <Popconfirm
        id="popConfirm"
        title={`Are you sure you want to ${
          isActive ? 'Unpublish' : 'Publish'
        } this item?`}
        icon={
          <QuestionCircleOutlined
            style={{ color: 'red' }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        }
        onConfirm={() => onActiveToggle(id)}
        okText="Yes"
      >
        <Space size="middle">
          <Switch
            checked={isActive}
            style={{ backgroundColor: isActive ? '#53C31B' : undefined }}
            id="publishSwitch"
          />
        </Space>
      </Popconfirm>
    );
  };

  const columns: ColumnsType<any> = [
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
      sorter: (a, b) => a.isActive - b.isActive,
      render: (text, record) => {
        return (
          <div className="py-4">
            <ActiveColumn
              id={record.key}
              isActive={record.isActive}
              onActiveToggle={(id) => {
                updateUniversityStatus(id)
                  .then((response) => {
                    if (response?.status === 200) {
                      notification.success({
                        message: response.data.message,
                      });
                    } else {
                      notification.error({
                        message: response.data.message,
                      });
                    }
                    window.location.reload();
                  })
                  .catch((error) => {
                    notification.error({ message: error.message });
                  });
              }}
            />
          </div>
        );
      },
    },
    {
      title: () => <span className="text-base font-semibold">Action</span>,
      key: 'action',
      align: 'center',
      width: '150px',
      render: (text, record) => (
        <div className="py-4">
          <ActionColumn id={record?.id} onDelete={handleDelete} />
        </div>
      ),
    },
  ];

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

              <Button
                type="primary"
                onClick={() => router.push('/university/create')}
                size="large"
                className="bg-dark-navy hover:bg-blue-700 text-white h-10 flex items-center gap-2 px-4"
                icon={
                  <PlusOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              >
                Add New University
              </Button>
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
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="h-11 rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors shadow-sm"
                    style={{
                      fontSize: '0.95rem',
                      paddingTop: '0',
                      paddingBottom: '0',
                    }}
                  />
                  {/* <div className="absolute top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                    {searchQuery
                      ? `${university.length} results`
                      : 'Type to search'}
                  </div> */}
                </div>
              </div>
            </div>

            {/* Table Section */}
            <Table
              loading={loading}
              scroll={{ x: true }}
              columns={columns}
              dataSource={university}
              rowKey="id"
              className="custom-table"
              pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
                showSizeChanger: false,
                total: university.length,
                className: 'pagination-custom',
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
      </div>
    </AdminLayout>
  );
}

export default UniversityList;

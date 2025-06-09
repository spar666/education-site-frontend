'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Empty, Card, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  EditTwoTone,
  SearchOutlined,
  UserOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import { fetchAllUser } from 'apps/admin/app/api/User';
import { capitalizeInitials } from 'apps/admin/helper/capitalize';

function UserList() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    async function fetchAllUsers() {
      setLoading(true);
      try {
        const response = await fetchAllUser();
        const data = response?.data.data;
        setUsers(data);
        setFilteredUsers(data); // Initialize filtered users with all users
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllUsers();
  }, []);

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const lowercaseQuery = value.toLowerCase();

    const filtered = users.filter((user: any) =>
      Object.values(user).some(
        (field) => field && String(field).toLowerCase().includes(lowercaseQuery)
      )
    );
    setFilteredUsers(filtered);
  };

  const ActionColumn = ({ record }: { record: any }) => {
    const { id } = record || {};
    return (
      <Space size="middle">
        <Link href={`/user/edit?id=${id}`} passHref>
          <Button
            type="text"
            icon={
              <EditTwoTone
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                className="text-lg"
                {...({} as AntdIconProps)}
              />
            }
            className="hover:bg-blue-50 transition-colors rounded-lg h-8 w-8 flex items-center justify-center"
          />
        </Link>
      </Space>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text) => (
        <span className="font-medium text-gray-900">{text || 'N/A'}</span>
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text) => (
        <span className="font-medium text-gray-900">{text || 'N/A'}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span className="text-gray-600 hover:text-blue-600 transition-colors">
          {text || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <span className="text-gray-600">{text || 'N/A'}</span>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => (
        <span className="capitalize text-gray-600">{text || 'N/A'}</span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => (
        <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600 inline-block">
          {text ? capitalizeInitials(text) : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => <ActionColumn record={record} />,
    },
  ];

  return (
    <AdminLayout title="User Management">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <Card className="shadow-md border-0 rounded-xl">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    User Management
                  </h1>
                  <p className="text-gray-500 text-sm">
                    View and manage all user accounts in the system
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex relative">
                      <Input
                        placeholder="Search users..."
                        size="middle"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        prefix={
                          <SearchOutlined
                            className="text-gray-400 text-lg"
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        }
                        className="flex w-[250px] h-[40px] mt-[-40px] rounded-lg hover:border-blue-400 focus:border-blue-500 pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="middle"
                    icon={
                      <PlusOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                    onClick={() => router.push('/user/create')}
                    className="bg-dark-navy hover:bg-blue-700  text-white flex items-center gap-2 shadow-sm"
                  >
                    Add New User
                  </Button>
                </div>

                <Table
                  dataSource={filteredUsers}
                  columns={columns}
                  loading={loading}
                  rowKey="_id"
                  className="custom-table"
                  pagination={{
                    pageSize: 10,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    total: users.length,
                    className: 'pagination-custom',
                  }}
                  onChange={(pagination) => {
                    router.push(`/user?page=${pagination.current}`, undefined);
                  }}
                  locale={{
                    emptyText: (
                      <Empty
                        description={
                          <span className="text-gray-500">
                            {searchQuery
                              ? 'No users found matching your search'
                              : 'No users found'}
                          </span>
                        }
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    ),
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export default UserList;

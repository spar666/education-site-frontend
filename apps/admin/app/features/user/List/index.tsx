'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Empty } from 'antd'; // Import Empty component
import { ColumnsType } from 'antd/lib/table';
import { EditTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import { fetchUniversity } from 'apps/admin/app/api/University';
import { fetchAllUser } from 'apps/admin/app/api/User';
import { capitalizeInitials } from 'apps/admin/helper/capitalize';

function UserList() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllUsers() {
      setLoading(true);
      try {
        const response = await fetchAllUser();
        setUsers(response?.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllUsers();
  }, []);

  const ActionColumn = ({ record }: { record: any }) => {
    const { id } = record || {};
    return (
      <Space size="middle" className="test">
        <Link href={`/user/edit?id=${id}`} passHref>
          <EditTwoTone
            className="text-2xl"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
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
      render: (text) => (text ? text : 'N/A'), // Handle null or undefined
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text) => (text ? text : 'N/A'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (text ? text : 'N/A'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (text ? text : 'N/A'),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => (text ? text : 'N/A'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => {
        if (text) {
          return capitalizeInitials(text);
        } else {
          return 'N/A'; // Handle null or undefined values
        }
      },
    },

    {
      title: 'Edit',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => <ActionColumn record={record} />,
    },
  ];

  return (
    <AdminLayout title="User">
      {/* Conditional rendering for the table or empty message */}

      <Table
        scroll={{ x: true }}
        title={() => {
          return (
            <>
              <div className="flex items-start justify-between my-3">
                <h3 className="text-xl font-bold">User</h3>
                <div className="flex justify-between  items-center">
                  <Button
                    type="primary"
                    onClick={() => router.push('/user/create')}
                    id="addGuide"
                    size={'large'}
                  >
                    Add New User
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <div className="font-bold">Search</div>
                  {/* <DebounceInput
                      className="w-[250px] input-h-45"
                      // text={search + ""}
                      placeholder="Search Course"
                      prefix={<SearchOutlined className="mx-2" />}
                      // callback={changeFilter('search')}
                      callback=""
                    /> */}
                </div>
              </div>
            </>
          );
        }}
        columns={columns}
        dataSource={users}
        pagination={{
          pageSize: 10, // Set the number of items per page
          hideOnSinglePage: true,
          showSizeChanger: false,
          total: users.length,
        }}
        onChange={(pagination) => {
          router.push(`/user?page=${pagination.current}`, undefined);
        }}
      />
    </AdminLayout>
  );
}

export default UserList;

'use client';
import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Switch, Table, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  DeleteOutlined,
  EditTwoTone,
  QuestionCircleOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import {
  fetchUniversity,
  updateUniversityStatus,
} from 'apps/admin/app/api/University';

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

        {/* <DeleteOutlined
          className="text-2xl text-red-500 mt-[-12px]"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onClick={() => onDelete(id)}
        /> */}
      </div>
    </Space>
  </>
);

function UniversityList() {
  const router = useRouter();
  const [university, setUniversity] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllUniversities() {
      setLoading(true);
      try {
        const response = await fetchUniversity();
        setUniversity(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllUniversities();
  }, []);

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
      title: 'Name',
      dataIndex: 'universityName',
      key: 'universityName',
    },
    {
      title: 'Address',
      dataIndex: 'universityAddress',
      key: 'universityAddress',
    },
    {
      title: 'Email',
      dataIndex: 'universityEmail',
      key: 'universityEmail',
    },

    {
      title: 'Published',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      sorter: (a, b) => a.isActive - b.isActive,
      render: (text, record) => {
        return (
          <ActiveColumn
            id={record.key}
            isActive={record.isActive}
            onActiveToggle={(id) => {
              updateUniversityStatus(id)
                .then((response) => {
                  // Handle success response
                  if (response?.status === 200) {
                    notification.success({
                      message: response.data.message,
                    });
                  } else {
                    notification.error({
                      message: response.data.message,
                    });
                  }
                  // Perform any additional actions like refetching
                  window.location.reload();
                })
                .catch((error) => {
                  // Handle error
                  notification.error({ message: error.message });
                });
            }}
          />
        );
      },
    },
    // {
    //   title: 'Contact Number',
    //   dataIndex: 'universityContactNumber',
    //   key: 'universityContactNumber',
    // },
    // {
    //   title: 'World Ranking',
    //   dataIndex: 'worldRanking',
    //   key: 'worldRanking',
    // },
    // {
    //   title: 'Country Ranking',
    //   dataIndex: 'countryRanking',
    //   key: 'countryRanking',
    // },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center', // <-- AlignType
      render: (text, record) => (
        <ActionColumn
          id={record?.id}
          record={record}
          name={record?.universityName}
          // onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="University">
      <Table
        scroll={{ x: true }}
        title={() => {
          return (
            <>
              <div className="flex items-start justify-between my-3">
                <h3 className="text-xl font-bold">University</h3>

                <div className="flex justify-between  items-center">
                  <Button
                    type="primary"
                    onClick={() => router.push('/university/create')}
                    id="addGuide"
                    size={'large'}
                  >
                    Add New University
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
        dataSource={university}
        pagination={{
          pageSize: 10, // Set the number of items per page
          hideOnSinglePage: true,
          showSizeChanger: false,
          total: university.length,
        }}
        onChange={(pagination) => {
          router.push(`/university?page=${pagination.current}`, undefined);
        }}
      />
    </AdminLayout>
  );
}

export default UniversityList;

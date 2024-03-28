'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EditTwoTone, VerifiedOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import { fetchUniversity } from 'apps/admin/app/api/University';

const ActionColumn = ({ id }: { id: string }) => (
  <Space size="middle" className="test">
    <Link href={`/blogs/edit/${id}`} passHref>
      <EditTwoTone
        className="text-2xl"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    </Link>
  </Space>
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

  const ActionColumn = ({ record }: { record: any }) => {
    console.log(record, 'rec');
    const { id } = record || {};
    return (
      <Space size="middle" className="test">
        <Link href={`/university/edit?id=${id}`} passHref>
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
      title: 'Contact Number',
      dataIndex: 'universityContactNumber',
      key: 'universityContactNumber',
    },
    {
      title: 'World Ranking',
      dataIndex: 'worldRanking',
      key: 'worldRanking',
    },
    {
      title: 'Country Ranking',
      dataIndex: 'countryRanking',
      key: 'countryRanking',
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

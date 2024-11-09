'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EditTwoTone, VerifiedOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import { fetchUniversity } from 'apps/admin/app/api/University';
import { fetchStudents } from 'apps/admin/app/api/Students';

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

function StudentList() {
  const router = useRouter();
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllStudents() {
      setLoading(true);
      try {
        const response = await fetchStudents();
        setStudent(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllStudents();
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
      title: 'FirstName',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'MiddleName',
      dataIndex: 'middleName',
      key: 'middleName',
      render: (middleName) => (middleName ? middleName : '-'),
    },
    {
      title: 'LastName',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Contact Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Counseling Option',
      dataIndex: 'counselingOption',
      key: 'counselingOption',
      render: (counselingOption) => {
        let buttonText = '';
        let buttonStyle = {};

        // Check if counselingOption is a valid string before calling toLowerCase
        if (typeof counselingOption === 'string') {
          if (counselingOption.toLowerCase() === 'inperson') {
            buttonText = 'In Person';
            buttonStyle = {
              backgroundColor: 'green',
              borderColor: 'green',
              color: 'white',
            };
          } else if (counselingOption.toLowerCase() === 'online') {
            buttonText = 'Online';
            buttonStyle = {
              backgroundColor: 'blue',
              borderColor: 'blue',
              color: 'white',
            };
          } else {
            buttonText = counselingOption;
            buttonStyle = {
              backgroundColor: 'black',
              borderColor: 'black',
              color: 'white',
            };
          }
        } else {
          buttonText = '-'; // Default value when counselingOption is null or not a string
          buttonStyle = {
            backgroundColor: 'gray',
            borderColor: 'gray',
            color: 'white',
          };
        }

        return <Button style={buttonStyle}>{buttonText}</Button>;
      },
    },
    {
      title: 'View',
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
                <h3 className="text-xl font-bold">Student List</h3>

                {/* <div className="flex justify-between  items-center">
                  <Button
                    type="primary"
                    onClick={() => router.push('/stude')}
                    id="addGuide"
                    size={'large'}
                  >
                    Add New University
                  </Button>
                </div> */}
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
        dataSource={student}
        pagination={{
          pageSize: 10, // Set the number of items per page
          hideOnSinglePage: true,
          showSizeChanger: false,
          total: student.length,
        }}
        onChange={(pagination) => {
          router.push(`/university?page=${pagination.current}`, undefined);
        }}
      />
    </AdminLayout>
  );
}

export default StudentList;

'use client';
import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Switch, Table, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditTwoTone,
  SearchOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import axios from 'axios';
import { fetchCourses } from 'apps/admin/app/api/Course';

const ActionColumn = ({ id }: any) => (
  <Space size="middle" className="test">
    <Link href={`/course/edit?id=${id}`} passHref>
      <EditTwoTone
        className="text-2xl"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    </Link>

    <Button type="text" id="verificationModal">
      <VerifiedOutlined
        className="text-2xl"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    </Button>
  </Space>
);

const ActiveColumn = ({ id, isActive, onActiveToggle, disable }: any) => (
  <Space size="middle">
    <Switch
      checked={isActive}
      disabled={disable}
      style={{ backgroundColor: isActive && '#53C31B' }}
      id="ratingSwitch"
    />
  </Space>
);

const FeatureColumn = ({ id, featured, onActiveToggle, disable }: any) => (
  <Space size="middle">
    <Switch
      checked={featured}
      disabled={disable}
      style={{ backgroundColor: featured && '#53C31B' }}
      id="publishSwitch"
    />
  </Space>
);

const ReviewColumn = ({ id }: any) => (
  <Space size="middle" className="test">
    <Link href={`/blogs/comments/${id}`} passHref>
      <Button size="small">Comment</Button>
    </Link>
  </Space>
);

function CourseList() {
  const router = useRouter();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllCourses() {
      setLoading(true);
      try {
        const response = await fetchCourses();
        console.log(response, 'from api');
        setCourse(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllCourses();
  }, []);

  // Define your columns
  const columns: ColumnsType<any> = [
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text) => (
        <span className="block overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 w-40">
          {text}
        </span>
      ),
    },
    {
      title: 'Course Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => (
        <span className="block overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 w-40">
          {text}
        </span>
      ),
    },

    {
      title: 'Published',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center', // <-- AlignType
      render: (text, record) => (
        <ActiveColumn
          id={record?.key}
          isActive={record?.isActive}
          disable={!record.verified}
        />
      ),
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      align: 'center', // <-- AlignType
      render: (text, record) => (
        <FeatureColumn
          id={record.key}
          disable={!record.verified}
          featured={record.isFeatured}
        />
      ),
    },
    {
      title: 'Edit',
      dataIndex: 'action',
      key: 'action',
      align: 'center', // <-- AlignType
      render: (text, record) => (
        <ActionColumn id={record?.id} record={record} />
      ),
    },
  ];

  // const changeFilter =
  //   (filterType) =>
  //   (value = null) => {
  //     router.push({
  //       pathname: '/blogs',
  //       query: {
  //         ...router.query,
  //         page: 1,
  //         [filterType]: value,
  //       },
  //     });
  //   };

  return (
    <AdminLayout title="Course">
      <Table
        title={() => {
          return (
            <>
              <div className="flex items-start justify-between my-3">
                <h3 className="text-xl font-bold">Courses</h3>

                <div className="flex justify-between  items-center">
                  <Button
                    type="primary"
                    onClick={() => router.push('/course/create')}
                    id="addGuide"
                    size={'large'}
                  >
                    Add New Course
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
        dataSource={course}
        // pagination={{
        //   current: Number(page),
        //   hideOnSinglePage: true,
        //   showSizeChanger: false,
        //   total: 10,
        // }}
        // onChange={(pagination) => {
        //   router.push(`/blogs?page=${pagination.current}`, undefined, {
        //     shallow: true,
        //   });
        // }}
      />
    </AdminLayout>
  );
}

export default CourseList;

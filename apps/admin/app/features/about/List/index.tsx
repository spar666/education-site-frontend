'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table, notification, Popconfirm, Switch } from 'antd';
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
import { fetchBlog } from 'apps/admin/app/api/Blogs';
import { fetchFaq } from 'apps/admin/app/api/FAQ';
import Image from 'next/image';
import { renderImage } from 'libs/services/helper';
import { fetchAboutUs, updateAboutStatus } from 'apps/admin/app/api/AboutUs';

function AboutList() {
  const router = useRouter();
  const [aboutUs, setAboutUs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllAboutUs() {
      setLoading(true);
      try {
        const response = await fetchAboutUs();
        setAboutUs(response?.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllAboutUs();
  }, []);

  const ActionColumn = ({ record }: { record: any }) => {
    console.log(record, 'rec');
    const { key } = record || {};
    return (
      <Space size="middle" className="test">
        <div className="flex items-center  space-x-5">
          <Link href={`/about/edit?id=${key}`} passHref>
            <span style={{ fontSize: '24px' }}>
              {' '}
              {/* Adjust the font size as needed */}
              <EditTwoTone
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <DeleteOutlined
                className="text-2xl text-red-500 mt-[-12px]"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </span>
          </Link>
        </div>
      </Space>
    );
  };

  const ActiveColumn = ({
    id,
    isActive,
    disable,
    onActiveToggle,
  }: {
    id: string;
    isActive: boolean;
    disable?: boolean;
    onActiveToggle: (id: string, newStatus: boolean) => void;
  }) => {
    console.log(isActive, 'isactve');
    return (
      <Popconfirm
        id="popConfirm"
        title={`Are you sure you want to ${
          isActive ? 'Unpublish' : 'Publish'
        } this about us?`}
        icon={
          <QuestionCircleOutlined
            style={{ color: 'red' }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        }
        onConfirm={() => onActiveToggle(id, !isActive)} // Pass the new status
        okText="Yes"
      >
        <Space size="middle">
          <Switch
            checked={isActive}
            disabled={disable}
            style={{ backgroundColor: isActive ? '#53C31B' : undefined }}
            id="ratingSwitch"
          />
        </Space>
      </Popconfirm>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <span className="block overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 w-40">
          {text}
        </span>
      ),
    },
    {
      title: 'Contents',
      dataIndex: 'contents',
      render: (text) => (
        <div
          className="block  overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 truncate"
          dangerouslySetInnerHTML={{
            __html: text || '',
          }}
        ></div>
      ),
    },

    {
      title: 'Cover Image',
      dataIndex: 'coverImage',
      render: (coverImage: any) => (
        <div className="relative w-10 h-10 overflow-hidden rounded-md">
          <Image
            src={`${renderImage({
              imgPath: coverImage || '',
              size: 'md',
            })}`}
            alt="Icon"
            layout="fill"
            objectFit="cover"
            className="block"
          />
        </div>
      ),
    },

    {
      title: 'Published',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      sorter: (a, b) => a.isActive - b.isActive,
      render: (text, record) => {
        console.log(record?.isActive, 'is i am active now');
        return (
          <ActiveColumn
            id={record?.key}
            isActive={record?.isActive}
            onActiveToggle={async (id) => {
              console.log(id, 'id for status update');
              try {
                const response = await updateAboutStatus({ id });
                if (response.data.status === '201') {
                  notification.success({
                    message: 'About update succesfully',
                  });
                  router.push('/banner');
                } else {
                  console.log(response, 'response');
                  notification.error({
                    message: 'Error',
                  });
                }
              } catch (error: any) {
                notification.error({ message: 'Error: ' + error.message });
              }
            }}
          />
        );
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

  const dataSource = aboutUs.map((item) => {
    const { id, title, contents, coverImage, isActive } = item;

    return {
      key: id,
      title,
      contents,
      coverImage,
      isActive,
    };
  });

  return (
    <AdminLayout title="Blogs">
      <Table
        title={() => (
          <div className="flex items-start justify-between my-3">
            <h3 className="text-xl font-bold">List of About</h3>
            <div className="flex justify-between  items-center">
              <Button
                type="primary"
                onClick={() => router.push('/about/create')}
                id="addGuide"
                size="large"
              >
                Add New
              </Button>
            </div>
          </div>
        )}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showSizeChanger: false,
          total: aboutUs.length,
        }}
        onChange={(pagination) => {
          router.push(`/about?page=${pagination.current}`, undefined);
        }}
      />
    </AdminLayout>
  );
}

export default AboutList;

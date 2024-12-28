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
import Image from 'next/image';
import { fetchBanner, updateBannerStatus } from 'apps/admin/app/api/Banner';
import { renderImage } from 'libs/services/helper';

function BannerList() {
  const router = useRouter();
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllBanner() {
      setLoading(true);
      try {
        const response = await fetchBanner();
        setBanner(response?.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllBanner();
  }, []);

  const ActionColumn = ({ record }: { record: any }) => {
    console.log(record, 'rec');
    const { key } = record || {};
    return (
      <Space size="middle" className="test">
        <div className="flex items-center  space-x-5">
          <Link href={`/banner/edit?id=${key}`} passHref>
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
          <div style={{ color: 'red' }}>
            <QuestionCircleOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>
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
        <span className="block overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 w-40">
          <div
            className="text-base leading-1.5 mt-3"
            dangerouslySetInnerHTML={{
              __html: text || '',
            }}
          ></div>
        </span>
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
        return (
          <ActiveColumn
            id={record.key}
            isActive={record.isActive}
            onActiveToggle={async (id) => {
              console.log(id, 'id');
              updateBannerStatus(id)
                .then((response) => {
                  // Handle success response
                  if (response?.data.status === '201') {
                    notification.success({
                      message: 'Banner updated succesfully',
                    });
                  } else {
                    notification.error({
                      message: 'Error',
                    });
                  }
                  // Perform any additional actions like refetching
                  window.location.reload();
                })
                .catch((error) => {
                  // Handle error
                  notification.error({ message: 'Error' });
                });
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

  const dataSource = banner.map((item) => {
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
            <h3 className="text-xl font-bold">List of Banner</h3>
            <div className="flex justify-between  items-center">
              <Button
                type="primary"
                onClick={() => router.push('/banner/create')}
                id="addGuide"
                size="large"
              >
                Add New Banner
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
          total: banner.length,
        }}
        onChange={(pagination) => {
          router.push(`/banner?page=${pagination.current}`, undefined);
        }}
      />
    </AdminLayout>
  );
}

export default BannerList;

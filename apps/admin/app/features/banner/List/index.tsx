'use client';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Space,
  Table,
  notification,
  Popconfirm,
  Switch,
  Typography,
  Empty,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  DeleteOutlined,
  EditTwoTone,
  QuestionCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import Image from 'next/image';
import {
  fetchBanner,
  updateBannerStatus,
  deleteBannerById,
} from 'apps/admin/app/api/Banner';
import { renderImage } from 'libs/services/helper';
import { Banner } from '../types';

const { Title, Text } = Typography;

function BannerList() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBanner();
      setBanners(response?.data.data || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch banners';
      setError(errorMessage);
      notification.error({ message: 'Error', description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateBannerStatus(id);
      notification.success({
        message: 'Status Updated',
        description: `Banner has been ${
          currentStatus ? 'unpublished' : 'published'
        } successfully`,
      });
      fetchBanners();
    } catch (error) {
      notification.error({
        message: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update banner status',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBannerById({ id });
      notification.success({
        message: 'Banner Deleted',
        description: 'Banner has been deleted successfully',
      });
      fetchBanners();
    } catch (error) {
      notification.error({
        message: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete banner',
      });
    }
  };

  const ActionColumn = ({ record }: { record: Banner }) => (
    <Space size="middle">
      <Link href={`/banner/edit?id=${record.id}`}>
        <EditTwoTone
          className="text-xl hover:text-blue-600 cursor-pointer transition-colors"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Link>
      <Popconfirm
        title="Delete Banner"
        description="Are you sure you want to delete this banner?"
        onConfirm={() => handleDelete(record.id)}
        okText="Yes"
        cancelText="No"
      >
        <DeleteOutlined
          className="text-xl text-red-500 hover:text-red-600 cursor-pointer transition-colors"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Popconfirm>
    </Space>
  );

  const StatusColumn = ({ record }: { record: Banner }) => (
    <Popconfirm
      title={`${record.isActive ? 'Unpublish' : 'Publish'} Banner`}
      description={`Are you sure you want to ${
        record.isActive ? 'unpublish' : 'publish'
      } this banner?`}
      onConfirm={() => handleStatusToggle(record.id, record.isActive)}
      okText="Yes"
      cancelText="No"
    >
      <Switch
        checked={record.isActive}
        className={record.isActive ? 'bg-green-500' : ''}
      />
    </Popconfirm>
  );

  const columns: ColumnsType<Banner> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text) => (
        <Text className="line-clamp-2 font-medium">{text}</Text>
      ),
    },
    {
      title: 'Content',
      dataIndex: 'contents',
      key: 'contents',
      width: '35%',
      render: (text) => (
        <div
          className="line-clamp-2 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: text || '' }}
        />
      ),
    },
    {
      title: 'Cover Image',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: '15%',
      render: (coverImage) => (
        <div className="relative w-20 h-12 rounded-md overflow-hidden">
          <Image
            src={renderImage({
              imgPath: coverImage || '',
              width: 160,
              height: 96,
            })}
            alt="Banner cover"
            layout="fill"
            objectFit="cover"
            className="transition-transform hover:scale-110"
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '12%',
      align: 'center',
      render: (_, record) => <StatusColumn record={record} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '13%',
      align: 'center',
      render: (_, record) => <ActionColumn record={record} />,
    },
  ];

  const dataSource = banners.map((banner) => ({
    ...banner,
    key: banner.id,
  }));

  return (
    <AdminLayout title="Banner Management">
      <div className="space-y-4 p-6">
        <div className="flex justify-between items-center">
          <Title level={3} className="!mb-0">
            Banners
          </Title>
          <Button
            type="primary"
            icon={
              <PlusOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            onClick={() => router.push('/banner/create')}
            size="large"
            className="hover:opacity-90 transition-opacity"
          >
            Add New Banner
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} banners`,
          }}
          locale={{
            emptyText: error ? (
              <Empty
                description={
                  <div className="text-red-500">
                    {error}
                    <Button
                      type="link"
                      onClick={fetchBanners}
                      className="block mx-auto mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                }
              />
            ) : (
              <Empty description="No banners found" />
            ),
          }}
          className="shadow-sm rounded-lg overflow-hidden"
        />
      </div>
    </AdminLayout>
  );
}

export default BannerList;

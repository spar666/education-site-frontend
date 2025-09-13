'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table, notification, Popconfirm, Switch } from 'antd';
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
import { renderImage } from 'libs/services/helper';
import { fetchAboutUs, updateAboutStatus } from 'apps/admin/app/api/AboutUs';

interface AboutUs {
  id: string;
  title: string;
  contents: string;
  coverImage: string;
  isActive: boolean;
}

interface AboutUsTableItem extends AboutUs {
  key: string;
}

interface ActionColumnProps {
  record: AboutUsTableItem;
}

interface ActiveColumnProps {
  id: string;
  isActive: boolean;
  disable?: boolean;
  onActiveToggle: (id: string, newStatus: boolean) => void;
}

function AboutList() {
  const router = useRouter();
  const [aboutUs, setAboutUs] = useState<AboutUs[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllAboutUs();
  }, []);

  const fetchAllAboutUs = async () => {
    setLoading(true);
    try {
      const response = await fetchAboutUs();
      setAboutUs(response?.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      notification.error({
        message: 'Failed to fetch about us data',
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string) => {
    try {
      const response = await updateAboutStatus({ id });
      if (response.data.status === '201') {
        notification.success({
          message: 'Status updated successfully',
        });
        fetchAllAboutUs(); // Refresh the data
      } else {
        notification.error({
          message: 'Failed to update status',
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error updating status',
        description: error.message,
      });
    }
  };

  const ActionColumn: React.FC<ActionColumnProps> = ({ record }) => (
    <Space size="middle">
      <div className="flex items-center gap-4">
        <Link href={`/about/edit?id=${record.key}`} passHref>
          <Button
            type="text"
            icon={
              <EditTwoTone
                className="text-lg"
                
                
              />
            }
            className="hover:bg-blue-50 transition-colors rounded-lg h-9 w-9 flex items-center justify-center border-0"
          />
        </Link>
        <Button
          type="text"
          icon={
            <DeleteOutlined
              className="text-lg"
              
              
            />
          }
          className="hover:bg-red-50 text-red-500 transition-colors rounded-lg h-9 w-9 flex items-center justify-center border-0"
        />
      </div>
    </Space>
  );

  const ActiveColumn: React.FC<ActiveColumnProps> = ({
    id,
    isActive,
    disable,
    onActiveToggle,
  }) => (
    <Popconfirm
      title={`Are you sure you want to ${
        isActive ? 'unpublish' : 'publish'
      } this content?`}
      icon={
        <QuestionCircleOutlined
          style={{ color: '#1677ff' }}
          
          
        />
      }
      onConfirm={() => onActiveToggle(id, !isActive)}
      okText="Yes"
      cancelText="No"
      placement="left"
    >
      <Switch
        checked={isActive}
        disabled={disable}
        className={isActive ? 'bg-green-500' : ''}
      />
    </Popconfirm>
  );

  const columns: ColumnsType<AboutUsTableItem> = [
    {
      title: () => <span className="text-base font-semibold">Title</span>,
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text: string) => (
        <div className="py-4 pl-4">
          <span className="text-base font-medium text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: () => <span className="text-base font-semibold">Content</span>,
      dataIndex: 'contents',
      key: 'contents',
      width: '35%',
      render: (text: string) => (
        <div className="py-4">
          <div
            className="text-gray-600 line-clamp-2 text-sm"
            dangerouslySetInnerHTML={{ __html: text || '' }}
          />
        </div>
      ),
    },
    {
      title: () => <span className="text-base font-semibold">Image</span>,
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: '15%',
      render: (coverImage: string) => (
        <div className="py-4">
          <div className="relative w-12 h-12 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={renderImage({ imgPath: coverImage || '' })}
              alt="Cover"
              layout="fill"
              objectFit="cover"
              className="transition-transform hover:scale-110"
            />
          </div>
        </div>
      ),
    },
    {
      title: () => <span className="text-base font-semibold">Status</span>,
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <div className="py-4">
          <ActiveColumn
            id={record.key}
            isActive={record.isActive}
            onActiveToggle={handleStatusUpdate}
          />
        </div>
      ),
    },
    {
      title: () => <span className="text-base font-semibold">Actions</span>,
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => <ActionColumn record={record} />,
    },
  ];

  const dataSource: AboutUsTableItem[] = aboutUs.map((item: AboutUs) => ({
    key: item.id,
    ...item,
  }));

  return (
    <AdminLayout title="About Us">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  About Us Management
                </h3>
                <p className="text-gray-500 mt-1">
                  Manage your organization's about us content
                </p>
              </div>

              <Button
                type="primary"
                onClick={() => router.push('/about/create')}
                size="large"
                className="bg-dark-navy hover:bg-blue-700 text-white h-10 flex items-center gap-2 px-4"
                icon={
                  <PlusOutlined
                    
                    
                  />
                }
              >
                Add New Content
              </Button>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table<AboutUsTableItem>
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                rowKey="key"
                className="custom-table"
                pagination={{
                  pageSize: 10,
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                  total: aboutUs.length,
                  className: 'pagination-custom',
                }}
                onChange={(pagination) => {
                  router.push(`/about?page=${pagination.current}`, undefined);
                }}
                locale={{
                  emptyText: (
                    <div className="py-8 text-center">
                      <QuestionCircleOutlined
                        className="text-4xl text-gray-300 mb-3"
                        
                        
                      />
                      <h3 className="text-gray-500 font-medium">
                        No content found
                      </h3>
                      <p className="text-gray-400">
                        Add some content to get started
                      </p>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AboutList;

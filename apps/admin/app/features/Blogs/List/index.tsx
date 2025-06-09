'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table, notification } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import { fetchBlog } from 'apps/admin/app/api/Blogs';

interface Author {
  firstName: string;
  lastName: string;
}

interface Blog {
  id: string;
  title: string;
  author: Author;
}

interface BlogTableItem {
  key: string;
  title: string;
  author: string;
}

interface ActionColumnProps {
  record: BlogTableItem;
}

function BlogsList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetchBlog();
      setBlogs(response?.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      notification.error({
        message: 'Failed to fetch blogs',
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const ActionColumn: React.FC<ActionColumnProps> = ({ record }) => (
    <Space size="middle">
      <div className="flex items-center gap-4">
        <Link href={`/blogs/edit?id=${record.key}`} passHref>
          <Button
            type="text"
            icon={
              <EditTwoTone
                className="text-lg"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            className="hover:bg-blue-50 transition-colors rounded-lg h-8 w-8 flex items-center justify-center border-0"
          />
        </Link>
        <Button
          type="text"
          icon={
            <DeleteOutlined
              className="text-lg text-red-500"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
          className="hover:bg-red-50 transition-colors rounded-lg h-8 w-8 flex items-center justify-center border-0"
        />
      </div>
    </Space>
  );

  const columns: ColumnsType<BlogTableItem> = [
    {
      title: () => <span className="text-base font-semibold">Title</span>,
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <div className="py-4 pl-4">
          <span className="text-base font-medium text-gray-800 line-clamp-1 max-w-md">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: () => <span className="text-base font-semibold">Author</span>,
      dataIndex: 'author',
      key: 'author',
      render: (text: string) => (
        <div className="py-4">
          <span className="text-gray-600">{text}</span>
        </div>
      ),
    },
    {
      title: () => <span className="text-base font-semibold">Actions</span>,
      key: 'action',
      align: 'center',
      width: '120px',
      render: (_, record) => <ActionColumn record={record} />,
    },
  ];

  const dataSource: BlogTableItem[] = blogs.map(({ id, title, author }) => ({
    key: id,
    title,
    author: author ? `${author.firstName} ${author.lastName}` : 'N/A',
  }));

  const handlePaginationChange = (pagination: TablePaginationConfig) => {
    router.push(`/blogs?page=${pagination.current}`);
  };

  return (
    <AdminLayout title="Blogs">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Blog Posts</h3>
                <p className="text-gray-500 mt-1">
                  Manage and organize your blog content
                </p>
              </div>

              <Button
                type="primary"
                onClick={() => router.push('/blogs/create')}
                size="large"
                className="bg-dark-navy hover:bg-blue-700 text-white h-10 flex items-center gap-2 px-4"
                icon={
                  <PlusOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              >
                Add New Blog
              </Button>
            </div>

            {/* Table Section */}
            <Table<BlogTableItem>
              loading={loading}
              columns={columns}
              dataSource={dataSource}
              rowKey="key"
              className="custom-table"
              pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
                showSizeChanger: false,
                total: blogs.length,
                className: 'pagination-custom',
              }}
              onChange={handlePaginationChange}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default BlogsList;

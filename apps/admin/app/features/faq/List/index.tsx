'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table, notification, Popconfirm, Switch } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  DeleteOutlined,
  EditTwoTone,
  VerifiedOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import { fetchBlog } from 'apps/admin/app/api/Blogs';
import { fetchFaq } from 'apps/admin/app/api/FAQ';

function FAQsList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllFAQ() {
      setLoading(true);
      try {
        const response = await fetchFaq();
        setBlogs(response?.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllFAQ();
  }, []);

  const ActionColumn = ({ record }: { record: any }) => {
    console.log(record, 'rec');
    const { key } = record || {};
    return (
      <Space size="middle" className="test">
        <div className="flex items-center  space-x-5">
          <Link href={`/faq/edit?id=${key}`} passHref>
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

  const columns: ColumnsType<any> = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      render: (text) => (
        <span className="block overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 w-40">
          {text}
        </span>
      ),
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
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
      title: 'Edit',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => <ActionColumn record={record} />,
    },
  ];

  const dataSource = blogs.map((item) => {
    const { id, question, answer } = item;

    return {
      key: id,
      question,
      answer,
    };
  });

  return (
    <AdminLayout title="Blogs">
      <Table
        title={() => (
          <div className="flex items-start justify-between my-3">
            <h3 className="text-xl font-bold">FAQs</h3>
            <div className="flex justify-between  items-center">
              <Button
                type="primary"
                onClick={() => router.push('/faq/create')}
                id="addGuide"
                size="large"
              >
                Add New FAQ
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
          total: blogs.length,
        }}
        onChange={(pagination) => {
          router.push(`/blogs?page=${pagination.current}`, undefined);
        }}
      />
    </AdminLayout>
  );
}

export default FAQsList;

'use client';
import React, { useEffect, useState } from 'react';
import { Button, Space, Table, notification, Typography } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { ColumnsType } from 'antd/lib/table';
import {
  DeleteOutlined,
  EditTwoTone,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import { fetchFaq } from 'apps/admin/app/api/FAQ';

const { Paragraph } = Typography;

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQTableItem {
  key: string;
  question: string;
  answer: string;
}

interface ActionColumnProps {
  record: FAQTableItem;
}

function FAQsList() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllFAQs();
  }, []);

  const fetchAllFAQs = async () => {
    setLoading(true);
    try {
      const response = await fetchFaq();
      setFaqs(response?.data.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      notification.error({
        message: 'Failed to fetch FAQs',
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const ActionColumn: React.FC<ActionColumnProps> = ({ record }) => (
    <Space size="middle">
      <div className="flex items-center gap-4">
        <Link href={`/faq/edit?id=${record.key}`} passHref>
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

  const columns: ColumnsType<FAQTableItem> = [
    {
      title: () => <span className="text-base font-semibold">Question</span>,
      dataIndex: 'question',
      key: 'question',
      width: '35%',
      render: (text: string) => (
        <div className="py-4 pl-4">
          <Paragraph
            className="text-base font-medium text-gray-800 mb-0"
            ellipsis={{ rows: 2, tooltip: text }}
          >
            {text}
          </Paragraph>
        </div>
      ),
    },
    {
      title: () => <span className="text-base font-semibold">Answer</span>,
      dataIndex: 'answer',
      key: 'answer',
      width: '45%',
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
      title: () => <span className="text-base font-semibold">Actions</span>,
      key: 'action',
      align: 'center',
      width: '20%',
      render: (_, record) => <ActionColumn record={record} />,
    },
  ];

  const dataSource: FAQTableItem[] = faqs.map(({ id, question, answer }) => ({
    key: id,
    question,
    answer,
  }));

  const handlePaginationChange = (pagination: TablePaginationConfig) => {
    router.push(`/faq?page=${pagination.current}`);
  };

  return (
    <AdminLayout title="FAQs">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-500 mt-1">
                  Manage and organize your FAQ content
                </p>
              </div>

              <Button
                type="primary"
                onClick={() => router.push('/faq/create')}
                size="large"
                className="bg-dark-navy text-white hover:bg-blue-700 text-white h-10 flex items-center gap-2 px-4"
                icon={
                  <PlusOutlined
                    
                    
                  />
                }
              >
                Add New FAQ
              </Button>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table<FAQTableItem>
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                rowKey="key"
                className="custom-table"
                pagination={{
                  pageSize: 10,
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                  total: faqs.length,
                  className: 'pagination-custom',
                }}
                onChange={handlePaginationChange}
                locale={{
                  emptyText: (
                    <div className="py-8 text-center">
                      <QuestionCircleOutlined
                        className="text-4xl text-gray-300 mb-3"
                        
                        
                      />
                      <h3 className="text-gray-500 font-medium">
                        No FAQs found
                      </h3>
                      <p className="text-gray-400">
                        Add some FAQs to get started
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

export default FAQsList;

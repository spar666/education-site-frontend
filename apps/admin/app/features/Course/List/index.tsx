'use client';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteOutlined,
  EditTwoTone,
  QuestionCircleOutlined,
  SearchOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import {
  deleteCourse,
  fetchCourses,
  updateCourseStatus,
} from 'apps/admin/app/api/Course';

const ActionColumn = ({ id, onDelete }: any) => (
  <>
    <Space size={[16, 16]} className="test">
      <div className="flex gap-5 items-center">
        <Link href={`/course/edit?id=${id}`} passHref>
          <EditTwoTone
            className="text-2xl"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </Link>

        {/* Delete icon */}
        <DeleteOutlined
          className="text-2xl text-red-500 mt-[-12px]"
          onClick={() => onDelete(id)} // Triggers the delete function
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>
    </Space>
  </>
);

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
        <QuestionCircleOutlined
          style={{ color: 'red' }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
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

const PublishColumn = ({ id, publish, onActiveToggle, disable }: any) => (
  <Space size="middle">
    <Switch
      checked={publish}
      style={{ backgroundColor: publish && '#53C31B' }}
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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState('');
  const [courseNameToDelete, setCourseNameToDelete] = useState('');

  useEffect(() => {
    async function fetchAllCourses() {
      setLoading(true);
      try {
        const response = await fetchCourses();
        setCourse(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllCourses();
  }, []);

  const handleDelete = async (id: string) => {
    // Show the delete confirmation modal
    setCourseToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(courseToDelete);
      setDeleteModalVisible(false);
      notification.success({
        message: 'Course deleted succesfully',
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete course.',
      });
    }
  };

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
      align: 'center',
      sorter: (a, b) => a.isActive - b.isActive,
      render: (text, record) => (
        <ActiveColumn
          id={record.id}
          isActive={record.isActive}
          onActiveToggle={(id) => {
            updateCourseStatus(id)
              .then((response) => {
                if (response?.status === 200) {
                  notification.success({
                    message: response.data.message,
                  });
                } else {
                  notification.error({
                    message: response.data.message,
                  });
                }
                window.location.reload();
              })
              .catch((error) => {
                notification.error({ message: error.message });
              });
          }}
        />
      ),
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      align: 'center',
      render: (text, record) => (
        <FeatureColumn id={record.key} featured={record.isFeatured} />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <ActionColumn id={record?.id} onDelete={handleDelete} />
      ),
    },
  ];

  return (
    <AdminLayout title="Course">
      <Table
        title={() => (
          <>
            <div className="flex items-start justify-between my-3">
              <h3 className="text-xl font-bold">Courses</h3>
              <div className="flex justify-between items-center">
                <Button
                  type="primary"
                  onClick={() => router.push('/course/create')}
                  size="large"
                >
                  Add New Course
                </Button>
              </div>
            </div>
          </>
        )}
        columns={columns}
        dataSource={course}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={confirmDelete}
        okText="Delete"
        okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
      >
        <p>Are you sure you want to delete the course?</p>
      </Modal>
    </AdminLayout>
  );
}

export default CourseList;

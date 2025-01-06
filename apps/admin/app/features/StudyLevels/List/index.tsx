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
import { EditTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import Logo from '../../../../../student/assets/Logo/Logo.png';
import {
  deleteCourse,
  fetchCourseCategories,
  fetchCourses,
  updateCourseStatus,
} from 'apps/admin/app/api/Course';
import Image from 'next/image';
import { renderImage } from 'libs/services/helper';
import { fetchStudyLevels } from 'apps/admin/app/api/studylevel';

const ActionColumn = ({ id, onDelete }: any) => (
  <>
    <Space size={[16, 16]} className="test">
      <div className="flex gap-5 items-center">
        <Link href={`/study-levels/edit?id=${id}`} passHref>
          <EditTwoTone
            className="text-2xl"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </Link>

        {/* Delete icon */}
        {/* <DeleteOutlined
          className="text-2xl text-red-500 mt-[-12px]"
          onClick={() => onDelete(id)} // Triggers the delete function
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        /> */}
      </div>
    </Space>
  </>
);

function StudyLevelsList() {
  const router = useRouter();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState('');
  const [courseNameToDelete, setCourseNameToDelete] = useState('');

  useEffect(() => {
    async function fetchAllStudyLevels() {
      setLoading(true);
      try {
        const response = await fetchStudyLevels();
        setLevels(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllStudyLevels();
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
      title: 'Level',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="block overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 w-40">
          {text}
        </span>
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
              <h3 className="text-xl font-bold">Study Levels</h3>
              {/* <div className="flex justify-between items-center">
                <Button
                  type="primary"
                  onClick={() => router.push('/course/create')}
                  size="large"
                >
                  Add New Course
                </Button>
              </div> */}
            </div>
          </>
        )}
        columns={columns}
        dataSource={levels}
      />

      {/* Delete Confirmation Modal */}
      {/* <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={confirmDelete}
        okText="Delete"
        okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
      >
        <p>Are you sure you want to delete the course?</p>
      </Modal> */}
    </AdminLayout>
  );
}

export default StudyLevelsList;

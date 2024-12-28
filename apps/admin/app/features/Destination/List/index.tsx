'use client';
import React, { useEffect, useState } from 'react';
import { Space, Table, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EditTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from 'apps/admin/components/SCLayout_v2';
import Logo from '../../../../../student/assets/Logo/Logo.png';
import Image from 'next/image';
import { renderImage } from 'libs/services/helper';
import { fetchAllUniversityByDestination } from 'apps/admin/app/api/Destinations';

const ActionColumn = ({ id, onDelete }: any) => (
  <>
    <Space size={[16, 16]} className="test">
      <div className="flex gap-5 items-center">
        <Link href={`/destination/edit?id=${id}`} passHref>
          <EditTwoTone
            className="text-2xl"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </Link>
      </div>
    </Space>
  </>
);

function DestinationList() {
  const router = useRouter();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllDestination() {
      setLoading(true);
      try {
        const response = await fetchAllUniversityByDestination();
        setCourse(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllDestination();
  }, []);

  // Define your columns
  const columns: ColumnsType<any> = [
    {
      title: 'Destination',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="block overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 w-40">
          {text}
        </span>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <div className="relative w-10 h-10 overflow-hidden rounded-md">
          <Image
            src={`${renderImage({
              imgPath: image || '',
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
    // {
    //   title: 'Course Slug',
    //   dataIndex: 'slug',
    //   key: 'slug',
    //   render: (text) => (
    //     <span className="block overflow-hidden whitespace-nowrap overflow-ellipsis line-clamp-1 w-40">
    //       {text}
    //     </span>
    //   ),
    // },
    // {
    //   title: 'Published',
    //   dataIndex: 'isActive',
    //   key: 'isActive',
    //   align: 'center',
    //   sorter: (a, b) => a.isActive - b.isActive,
    //   render: (text, record) => (
    //     <ActiveColumn
    //       id={record.id}
    //       isActive={record.isActive}
    //       onActiveToggle={(id) => {
    //         updateCourseStatus(id)
    //           .then((response) => {
    //             if (response?.status === 200) {
    //               notification.success({
    //                 message: response.data.message,
    //               });
    //             } else {
    //               notification.error({
    //                 message: response.data.message,
    //               });
    //             }
    //             window.location.reload();
    //           })
    //           .catch((error) => {
    //             notification.error({ message: error.message });
    //           });
    //       }}
    //     />
    //   ),
    // },
    // {
    //   title: 'Featured',
    //   dataIndex: 'isFeatured',
    //   key: 'isFeatured',
    //   align: 'center',
    //   render: (text, record) => (
    //     <FeatureColumn id={record.key} featured={record.isFeatured} />
    //   ),
    // },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => <ActionColumn id={record?.id} />,
    },
  ];

  return (
    <AdminLayout title="Destination">
      <Table
        title={() => (
          <>
            <div className="flex items-start justify-between my-3">
              <h3 className="text-xl font-bold">Destination</h3>
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
        dataSource={course}
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

export default DestinationList;

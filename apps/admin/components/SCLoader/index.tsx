'use client';
import { LoadingOutlined } from '@ant-design/icons';
import { Modal, Spin } from 'antd';

export default function JTLoader({ visible }: any) {
  return (
    <Modal
      title={null}
      visible={visible}
      destroyOnClose
      footer={null}
      closable={false}
      centered
      width={350}
    >
      <div className="text-center">
        <Spin
          className="mt-6"
          indicator={
            <LoadingOutlined
              style={{ fontSize: 34 }}
              spin
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
        />
        <h1>Loading...</h1>
      </div>
    </Modal>
  );
}

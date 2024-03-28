import { InboxOutlined } from '@ant-design/icons';
import Dragger, { DraggerProps } from 'antd/lib/upload/Dragger';
import React from 'react';

const SCDragger = ({
  children,
  ...rest
}: DraggerProps & { children?: React.ReactNode }) => {
  return (
    <Dragger {...rest}>
      {children || (
        <>
          <p className="ant-upload-drag-icon">
            <InboxOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </>
      )}
    </Dragger>
  );
};

export default SCDragger;

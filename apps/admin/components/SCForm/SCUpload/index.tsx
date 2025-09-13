'use client';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Upload,
  UploadFile,
  UploadProps,
  Modal,
  notification,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form';
import { renderImage } from 'libs/services/helper';

interface UploadResponseData {
  url: string;
  publicId: string;
  folder: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

interface UploadResponse {
  success: boolean;
  data: UploadResponseData;
}

interface SCUploadProps<T extends Record<string, any>> {
  name: Path<T>;
  control?: Control<T>;
  label?: React.ReactNode;
  error?: any;
  parentClass?: string;
  required?: boolean;
  multiple?: boolean;
  cropAspect?: number;
  folder?: string;
  maxCount?: number;
  accept?: string;
  disabled?: boolean;
  onFileUpload: (publicId: string, imageUrl?: string) => void;
  defaultFileList?: UploadFile[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const SCUpload = <T extends Record<string, any>>({
  name,
  control,
  label,
  error,
  parentClass,
  required = false,
  multiple = false,
  cropAspect = 1,
  folder = 'Uploads',
  maxCount,
  accept = 'image/*',
  disabled = false,
  onFileUpload,
  defaultFileList = [],
}: SCUploadProps<T>) => {
  const [uploadState, setUploadState] = useState({
    loading: false,
    previewOpen: false,
    previewImage: '',
    previewTitle: '',
  });
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);

  // Sync fileList with defaultFileList
  useEffect(() => {
    setFileList(defaultFileList);
  }, [defaultFileList]);

  // Cleanup preview image
  useEffect(() => {
    return () => {
      if (uploadState.previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(uploadState.previewImage);
      }
    };
  }, [uploadState.previewImage]);

  const handleUploadState = (updates: Partial<typeof uploadState>) => {
    setUploadState((prev) => ({ ...prev, ...updates }));
  };

  const customRequest: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    handleUploadState({ loading: true });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const { data } = await axios.post<UploadResponse>(
        `${API_URL}/media/upload`,
        formData,
        { headers: { 'content-type': 'multipart/form-data' } }
      );

      console.log('Upload response:', data);

      if (!data.success) throw new Error('Upload failed');

      onSuccess?.(data);
      const { publicId, url } = data.data;
      
      console.log('Uploaded file data:', { publicId, url });

      const newFile: any = {
        uid: publicId,
        name: (file as File).name || publicId.split('/').pop() || 'image',
        status: 'done',
        url,
        publicId,
      };

      if (!multiple) {
        setFileList([newFile]);
      } else {
        setFileList((prev) => [...prev, newFile]);
      }

      onFileUpload(publicId, url);
    } catch (err: unknown) {
      const error = err as Error;
      onError?.(error);
      notification.error({
        message: 'Upload Failed',
        description: error.message || 'Failed to upload image',
      });
    } finally {
      handleUploadState({ loading: false });
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (file.size && file.size > 10 * 1024 * 1024) {
      notification.warning({
        message: 'Large File',
        description: 'Preview might be slow for large files',
      });
    }

    let previewImage = file.url || '';
    let previewTitle = file.name || file.url?.split('/').pop() || 'Preview';

    if (!previewImage && file.originFileObj) {
      previewImage = await getBase64(file.originFileObj);
    }

    // Debug logging
    console.log('Preview Image URL:', previewImage);
    console.log('File object:', file);

    handleUploadState({
      previewImage,
      previewTitle,
      previewOpen: true,
    });
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const renderUploadButton = () => (
    <div>
      {uploadState.loading ? (
        <LoadingOutlined
          style={{ fontSize: 24 }}
          
          
        />
      ) : (
        <>
          <PlusOutlined
            
            
          />
          <div style={{ marginTop: 8 }}>Upload</div>
        </>
      )}
    </div>
  );

  const renderUploadComponent = (
    value?: UploadFile[],
    onChange?: (value: UploadFile[]) => void
  ) => (
    <ImgCrop
      aspect={cropAspect}
      quality={1}
      modalTitle="Edit Image"
      modalOk="Confirm"
      modalCancel="Cancel"
    >
      <Upload
        customRequest={customRequest}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={({ fileList: newFileList }) => {
          console.log('File list changed:', newFileList);
          setFileList(newFileList);
          if (onChange) {
            onChange(newFileList);
          }
        }}
        multiple={multiple}
        accept={accept}
        disabled={disabled || uploadState.loading}
        maxCount={multiple ? maxCount : 1}
      >
        {(!multiple && fileList.length === 0) ||
        (multiple && fileList.length < (maxCount || Infinity))
          ? renderUploadButton()
          : null}
      </Upload>
    </ImgCrop>
  );

  return (
    <div className={parentClass}>
      {label && (
        <label>
          {label}
          {required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}

      <div className="mt-1">
        {control ? (
          <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) =>
              renderUploadComponent(value, onChange)
            }
          />
        ) : (
          renderUploadComponent(fileList, (newFileList) => {
            setFileList(newFileList);
          })
        )}
      </div>

      <Modal
        open={uploadState.previewOpen}
        title={uploadState.previewTitle}
        footer={null}
        onCancel={() => handleUploadState({ previewOpen: false })}
        width="80%"
        style={{ top: 20 }}
      >
        <img
          alt={uploadState.previewTitle}
          style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          src={uploadState.previewImage}
          onError={(e) => {
            console.error('Image failed to load:', uploadState.previewImage);
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
          }}
        />
      </Modal>

      {error && (
        <div className="mt-1 mb-4">
          <Alert
            message={typeof error === 'string' ? error : error?.message}
            type="error"
            showIcon
          />
        </div>
      )}
    </div>
  );
};

export default SCUpload;

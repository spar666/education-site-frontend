import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Upload, UploadProps, notification } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

let API_URL = process.env.NEXT_PUBLIC_API_URL;

const getSrcFromFile = ({ file }: any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });
};

type SCUploadTypes = UploadProps & {
  name: string;
  control: Control<any>;
  label?: any;
  error?: any;
  parentClass?: string;
  labelClass?: string;
  required?: boolean;
  loading?: boolean;
  multiple?: boolean;
  isCrop?: boolean;
  doc_type?: string;
  status?: boolean;
  cropAspect?: number;
  forGuide?: boolean;
  register: any;
  setImageUploading?: Dispatch<SetStateAction<boolean>>;
  onFileUpload: (urls: string[]) => void; // Add onFileUpload prop
};

const SCUpload = ({
  name,
  control,
  label,
  error,
  parentClass,
  labelClass,
  required = false,
  loading = false,
  multiple = false,
  isCrop = true,
  doc_type,
  status,
  cropAspect,
  forGuide = false,
  register,
  setImageUploading,
  onFileUpload, // Receive onFileUpload prop
  ...rest
}: SCUploadTypes) => {
  const [uploadLoad, setUploadLoad] = useState(false);

  const customRequest = ({ file, onSuccess }: any) => {
    setUploadLoad(true);
    const data = new FormData();
    data.append('imageFile', file);
    if (doc_type) {
      data.append('type', doc_type);
    }

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios
      .post(`${API_URL}/uploads/`, data, config)
      .then((res: any) => {
        onSuccess('ok', file); // For antd Upload component to mark as successful

        setUploadLoad(false);
        notification.success({ message: `File uploaded successfully.` });
        const uploadedUrls = res.data.filename;
        console.log(uploadedUrls);
        onFileUpload(uploadedUrls); // Pass the uploaded URLs to the parent component
      })
      .catch((err: Error) => {
        setUploadLoad(false);
        notification.error({ message: `File upload failed.` });
      })
      .finally(() => setImageUploading && setImageUploading(false));
  };

  return (
    <div className={parentClass}>
      {label && (
        <label className={labelClass}>
          {label}
          {required && '*'}
        </label>
      )}
      <div className="mt-1">
        <Controller
          {...register(name)}
          name={name}
          control={control}
          render={({ field }) => {
            const { value, onChange } = field;
            return (
              <ImgCrop aspect={cropAspect || 2 / 1} quality={1}>
                <Upload
                  customRequest={customRequest}
                  listType="picture-card"
                  fileList={field.value || []}
                  onChange={({ fileList: newFileList }) => {
                    field.onChange(newFileList);
                  }}
                  {...rest}
                >
                  {multiple ? (
                    <div>
                      <PlusOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  ) : (
                    (!field.value || field.value.length === 0) &&
                    (uploadLoad ? (
                      <LoadingOutlined
                        style={{ fontSize: 24 }}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    ) : (
                      <div>
                        <PlusOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    ))
                  )}
                </Upload>
              </ImgCrop>
            );
          }}
        />
      </div>
      {error && (
        <div className="mt-1 mb-4">
          <Alert message={error} type="error" />
        </div>
      )}
    </div>
  );
};

export default SCUpload;

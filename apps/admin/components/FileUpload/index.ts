import { notification } from 'antd';
import axios, { AxiosResponse } from 'axios';

export interface UploadedFile {
  uid: string;
  name: string;
  status: 'done' | 'error' | 'uploading' | 'removed' | 'success' | 'removed';
  url: string;
}
const UPLOAD_URL = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL;

export const getImage = async (filename: string): Promise<string> => {
  try {
    const response: AxiosResponse<{ url: string[] }> = await axios.get(
      `${UPLOAD_URL}?filename=${filename}`
    );
    return response.data.url[0];
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image');
  }
};

export const uploadFile = async (file: File): Promise<UploadedFile> => {
  try {
    if (!file) {
      throw new Error('File is undefined');
    }

    const formData = new FormData();
    formData.append('file', file);
    const response: any = await axios.post(`${UPLOAD_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.length > 0) {
      const filename = response.data[0].filename;
      const url = await getImage(filename);
      const fileObj: UploadedFile = {
        uid: filename,
        name: filename,
        status: 'done',
        url: url,
      };
      notification.success({ message: 'File uploaded successfully.' });
      return fileObj;
    } else {
      throw new Error('No file data received');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    notification.error({ message: 'File upload failed.' });
    throw new Error('File upload failed');
  }
};

export const uploadPrivateFile = async (file: File): Promise<UploadedFile> => {
  try {
    if (!file) {
      throw new Error('File is undefined');
    }

    const formData = new FormData();
    formData.append('file', file);
    const response: AxiosResponse<{ filename: string }[]> = await axios.post(
      `${UPLOAD_URL}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.length > 0) {
      const filename = response.data[0].filename;
      const url = await getImage(filename);
      const fileObj: UploadedFile = {
        uid: filename,
        name: filename,
        status: 'done',
        url: url,
      };
      notification.success({ message: 'File uploaded successfully.' });
      return fileObj;
    } else {
      throw new Error('No file data received');
    }
  } catch (error) {
    console.error('Error uploading private file:', error);
    notification.error({ message: 'File upload failed.' });
    throw new Error('File upload failed');
  }
};

export const splitUrls = (urls: string[]): UploadedFile[] => {
  return urls.map((url) => ({
    uid: url,
    name: url.split('/').pop() || url,
    status: 'done',
    url: url,
  }));
};

export const splitUrlString = (url: string): UploadedFile[] => {
  return [
    {
      uid: url,
      name: url,
      status: 'done',
      url: url,
    },
  ];
};

export const splitPrivateUrls = (urls: string[]): UploadedFile[] => {
  return urls.map((url) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('?')[0];
    return {
      uid: filename,
      name: filename,
      status: 'done',
      url: url,
    };
  });
};

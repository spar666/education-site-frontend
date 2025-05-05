import axios, { AxiosError, AxiosInstance } from 'axios';

// Config
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const MEDIA_URL = `${API_URL}/media`;

// Types
type UploadParams = {
  file: File;
  folder?: string;
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
  format?: string;
  tags?: string[];
};

type DownloadParams = {
  publicId: string;
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
  format?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Handle errors
const handleError = (error: unknown): ApiResponse<never> => {
  const err = error as AxiosError;
  console.error('Error:', err.message);
  return { success: false, error: err.message };
};

// Media functions
export const uploadImage = async (params: UploadParams): Promise<ApiResponse<{ url: string }>> => {
  try {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('folder', params.folder || 'uploads');
    
    const transformations = {
      width: params.width,
      height: params.height,
      crop: params.crop,
      quality: params.quality,
      format: params.format
    };
    
    formData.append('transformations', JSON.stringify(transformations));
    
    if (params.tags) formData.append('tags', params.tags.join(','));
    
    const res = await api.post(`${MEDIA_URL}/upload`, formData);
    return { success: true, data: res.data };
  } catch (error) {
    return handleError(error);
  }
};

export const getImageUrl = async (params: DownloadParams): Promise<ApiResponse<{ url: string }>> => {
  try {
    const transformations = {
      width: params.width,
      height: params.height,
      crop: params.crop,
      quality: params.quality,
      format: params.format
    };
    
    const res = await api.get(`${MEDIA_URL}/image/${params.publicId}`, {
      params: { transformations: JSON.stringify(transformations) }
    });
    
    return { success: true, data: res.data };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteImage = async (publicId: string): Promise<ApiResponse<void>> => {
  try {
    await api.delete(`${MEDIA_URL}/${publicId}`);
    return { success: true };
  } catch (error) {
    return handleError(error);
  }
};
import axios from "axios";

interface MediaFile {
  uid: string;
  name: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url: string;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
  };
}

interface UploadOptions {
  folder?: string;
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    [key: string]: any;
  };
  tags?: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class MediaUploader {
  static async uploadFile(
    file: File,
    folder: any 
  ): Promise<any> {
    if (!file) throw new Error('No file provided');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (folder) formData.append('folder', folder);
     

      const response = await axios.post<{
        data: {
          url: string;
          publicId: string;
          dimensions?: { width?: number; height?: number };
          format?: string;
          size?: number;
        };
      }>(`${API_BASE_URL}/media/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          // Optional: Add progress tracking
        }
      });

      return {
        uid: response.data.data.publicId,
        name: file.name,
        status: 'done',
        url: response.data.data.url,
        metadata: {
          width: response.data.data.dimensions?.width,
          height: response.data.data.dimensions?.height,
          format: response.data.data.format,
          size: response.data.data.size
        }
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  static async uploadFiles(
    files: File[],
    folder: string
  ): Promise<MediaFile[]> {
    return Promise.all(files.map(file => this.uploadFile(file, folder)));
  }

  static createMediaFiles(urls: string[]): MediaFile[] {
    return urls.map(url => ({
      uid: url,
      name: this.extractFilename(url),
      status: 'done',
      url
    }));
  }

  private static extractFilename(url: string): string {
    try {
      return new URL(url).pathname.split('/').pop() || url;
    } catch {
      return url.split('/').pop() || url;
    }
  }
}

export default MediaUploader;
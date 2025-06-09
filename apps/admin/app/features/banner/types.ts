export interface Banner {
  id: string;
  title: string;
  contents: string;
  coverImage: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerResponse {
  data: {
    data: Banner[];
    status: number;
    message?: string;
  };
}

export interface BannerPayload {
  id?: string;
  title: string;
  contents: string;
  coverImage: string;
}

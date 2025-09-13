// const API_URL: string = process.env.NEXT_PUBLIC_API_URL || ""; 

// type EImageSize = "sm" | "md" | "lg";

// export function renderImage({
//   size = "lg",
//   imgPath,
//   gSize,
// }: {
//   size?: EImageSize;
//   imgPath: string;
//   gSize?: number | string | null;
// }): string {
  

//   let imageUrl = `${API_URL}/media/image/${imgPath}`;
//   console.log(imageUrl, "url");

//   if (gSize) {
//     imageUrl = imageUrl.split("=")[0] + `=s${gSize}`;
//   }

//   return imageUrl;
// }

// libs/services/helper.ts
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;

export function renderImage({
  imgPath,
  width,
  height,
  quality = 'auto',
  format = 'auto',
}: {
  imgPath: string;
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}): string {
  if (!imgPath) return '';

  // Remove any existing transformations from the path
  const cleanPath = imgPath;

  // Build transformation parameters
  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    `c_fill`,
    ...(width ? [`w_${width}`] : []),
    ...(height ? [`h_${height}`] : []),
  ].filter(Boolean).join(',');

  const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME || 'studycourse';

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/v1/${cleanPath}`;
}

// export const renderMedia = ({ imgPath, size = 'md' }: { imgPath: string; size?: string }) => {
  
//   if (!imgPath) return '';
//   const baseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/v1/university/${cleanPath}`;
//   return `${baseUrl}/${size}/${imgPath}`;
// };

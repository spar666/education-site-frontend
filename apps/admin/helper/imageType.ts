
export function isImageType(file: File) {
  const isPNG = file.type === "image/png";
  const isJPG = file.type == "image/jpg" || file.type === "image/jpeg";
  const isWebp = file.type === "image/webp";
  const isSVG = file.type === "image/svg";

  const isImage = isPNG || isJPG || isWebp || isSVG;

  return isImage;
}
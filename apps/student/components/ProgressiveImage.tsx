'use client';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import GProgressiveImage from 'react-progressive-graceful-image';

function ProgressiveImageLoading({
  srcImage,
  openImage = false,
  parentClass,
  sizes = '(max-width: 400px) 75vw, (max-width: 800px) 65vw, 30vw',
  imageHeight = 'h-[320px]',
  imageClass = 'w-full object-cover transition duration-500 hover:scale-110',
  ...rest
}: any) {
  return (
    <div
      className={clsx(
        'rounded-xl overflow-hidden cursor-pointer relative w-full',
        imageHeight,
        parentClass
      )}
    >
      <GProgressiveImage
        noLazyLoad
        placeholder="/image-placeholder.webp"
        src={srcImage}
        children={(src, loading) => (
          <Image
            layout="fill"
            quality="75"
            sizes={sizes}
            onClick={() => openImage && window.open(srcImage)}
            className={clsx(
              imageClass,
              loading ? ' blur-md' : '',
              'bg-gray-200'
            )}
            src={src}
            alt="an awesome image"
            {...rest}
          />
        )}
      />
    </div>
  );
}

export default ProgressiveImageLoading;

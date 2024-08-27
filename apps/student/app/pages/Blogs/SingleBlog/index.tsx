import React from 'react';
import Image from 'next/image';
import { renderImage } from 'libs/services/helper';

const Blog = ({ title, image, contents }: any) => {
  return (
    <div className="rounded-lg w-[350px] ">
      <div className="bg-white  h-[300px]  relative overflow-hidden">
        <div
          style={{
            backgroundImage: `url(${renderImage({
              imgPath: image || '',
              size: 'md',
            })})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        ></div>
      </div>
      <h1 className="p-2 font-bold text-gray-800 items-center hover:text-blue-500">
        {title}
      </h1>
    </div>
  );
};

export default Blog;

import React from 'react';
import Image from 'next/image';
import { renderImage } from 'libs/services/helper';

const Blog = ({ title, image, contents }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md mx-2 xl:mx-10 h-[300px] w-[400px] relative overflow-hidden">
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
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-4">
            <h5 className="text-lg font-['Open_Sans']">{title}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

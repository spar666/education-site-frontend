import Image from 'next/image';
import React from 'react';

const Blog = ({ title, image, contents }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <Image
        src={image}
        alt={title}
        className="rounded-t-lg w-full h-48 object-cover"
        width={100}
        height={100}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-700">{contents}</p>
      </div>
    </div>
  );
};

export default Blog;

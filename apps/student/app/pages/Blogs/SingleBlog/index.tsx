import React from 'react';
import Image from 'next/image';
import { renderImage } from 'libs/services/helper';
import { Calendar, ChevronRight, MoveRightIcon } from 'lucide-react';
import Link from 'next/link';

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  // Extract day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  // Determine the ordinal suffix for the day
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';

  // Format and return
  return `${day}${suffix} ${month} ${year}`;
}

interface BlogProps {
  title: string;
  image: string;
  slug: string;
  createdDate: string;
}

const Blog: React.FC<BlogProps> = ({ title, image, slug, createdDate }) => {
  return (
    <div className="rounded-lg w-[350px] gap-5">
      {/* Image Section */}
      <div className="bg-white h-[200px] w-[350px] rounded-lg relative overflow-hidden">
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

      {/* Date Section */}
      <span className="py-5 flex items-center">
        <Calendar className="h-5" />
        <span className="ml-2">{formatDate(createdDate)}</span>
      </span>

      {/* Title Section */}
      <h1 className="font-bold text-dark-blue text-xl hover:text-blue-500">
        {title}
      </h1>

      {/* "See More" Section */}
      <Link href={`blog/details/${slug}`}>
        <span className="flex text-dark-blue cursor-pointer  mt-2 hover:underline">
          Read More <ChevronRight />
        </span>
      </Link>
    </div>
  );
};

export default Blog;

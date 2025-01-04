'use client';

import Link from 'next/link';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  universities: {
    id: string;
    universityName: string;
    slug: string;
  };
}

interface DestinationListProps {
  destinations: Destination[];
  onClose: () => void;
}

export const DestinationList = ({
  destinations,
  onClose,
}: DestinationListProps) => (
  <div className="relative bg-white">
    <div className="max-w-[800px] mx-auto">
      <div className="flex justify-between items-center gap-4 pb-5">
        {destinations?.map((dest: Destination) => (
          <div key={dest.id}>
            <span className="font-bold text-gray-800 items-center hover:text-blue-500">
              {dest.name}
            </span>
            <div className="flex flex-col">
              <Link
                href={`/university/country/${dest.slug}`}
                className="text-base text-gray-800 items-center hover:text-blue-500"
              >
                Universities in {dest.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

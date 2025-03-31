'use client';
import { ChevronRight } from 'lucide-react';
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
  }[];
}

interface DestinationListProps {
  destinations: Destination[];
  onClose: () => void;
}

export const DestinationList = ({
  destinations,
  onClose,
}: DestinationListProps) => (
  <div className="bg-white rounded-lg shadow-lg p-6 w-full  mx-auto">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {destinations?.map((dest) => (
        <div
          key={dest.id}
          className="group transition-colors duration-200"
          onClick={onClose}
        >
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {dest.name}
            </h3>
            <Link
              href={`/university/country/${dest.slug}`}
              className="text-sm text-gray-600 hover:text-blue-500 transition-colors flex items-center"
            >
              <span>
                {dest.universities?.length || 0} Universities
                <span className="ml-1 text-blue-500">→</span>
              </span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

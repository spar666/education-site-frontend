'use client';
import { fetchAllUniversityByDestination } from 'apps/student/app/api/studyDestination';
import { renderImage } from 'libs/services/helper';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface IDestination {
  id: string;
  name: string;
  slug: string;
  image: string;
}

function index() {
  const [destinations, setDestinations] = useState<IDestination[]>([]);
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const universities = await fetchAllUniversityByDestination();
        setDestinations(universities);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      }
    };

    fetchDestinations();
  }, []);
  return (
    <section id="destinations" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900  mb-4">
          Top Destinations
        </h2>
        <p className="text-gray-600  mb-12">
          We have quality partners in a variety of destinations around the globe
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination?.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
            >
              <div className="text-4xl mb-4">
                <Image
                  src={`${renderImage({
                    imgPath: destination?.image || '',
                  })}`}
                  height={300}
                  width={300}
                  alt="Icon"
                  className="block"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-medium text-blue-900">
                {destination.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default index;

'use client';

import React, { useState, useEffect } from 'react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { cn } from 'libs/utils';
import Link from 'next/link';
import Image from 'next/image'; // For optimized image handling
import Logo from '../../../assets/Logo/Logo.png'; // Ensure the path is correct
import USA from '../../../assets/images/usa.jpg';
import Aus from '../../../assets/images/australia.jpg';
import Uk from '../../../assets/images/uk.jpg';
import Frn from '../../../assets/images/france.jpg';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';
import { renderImage } from 'libs/services/helper';

// Interface for Destination
interface IDestination {
  name: string;
  slug: string;
  image: string;
}

// Updated Country Component
export const Country = ({ country, countryImage, slug }: any) => {
  return (
    <Link href={`/university/country/${slug}`}>
      <div className="h-[100px] w-[100px] overflow-hidden hover:border-blue-500 transition duration-300">
        <Image
          src={`${renderImage({
            imgPath: countryImage || '',
            size: 'lg',
          })}`}
          height={500}
          width={500}
          alt="Icon"
          className="block"
        />
      </div>
    </Link>
  );
};

export const UniversityPage = () => {
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
    <section className="my-10">
      <MaxWidthWrapper>
        <div className="mb-10">
          <h2 className="text-xl sm:text-3xl font-bold italic tracking-tight text-dark-blue mb-4">
            Top Destinations
          </h2>
          <p className="text-gray-500 mt-2">
            We have quality partners in a variety of destinations around the
            globe.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="border border-gray-300 shadow-lg flex flex-col items-center justify-center p-6 rounded-lg"
            >
              <Country
                country={destination.name}
                countryImage={destination.image}
                slug={destination.slug}
              />
              <span className="mt-4 text-center text-base font-bold text-gray-700">
                {destination.name}
              </span>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

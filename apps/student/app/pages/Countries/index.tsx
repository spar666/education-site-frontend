'use client';
import React, { useState, useEffect } from 'react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Country } from '../Country';
import USA from '../../../assets/images/usa.jpg';
import Aus from '../../../assets/images/australia.jpg';
import Uk from '../../../assets/images/uk.jpg';
import Frn from '../../../assets/images/france.jpg';
import CarouselControls from 'apps/student/components/CarouselControls';
import { cn } from 'libs/utils';
import Link from 'next/link';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';

interface IDestination {
  name: string;
  slug: string;
}

export const UniversityPage = () => {
  const [destination, setDestination] = useState<IDestination[]>([]);
  const [firstSlug, setFirstSlug] = useState<string>('');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universities = await fetchAllUniversityByDestination();
        setDestination(universities);
        if (universities.length > 0) {
          setFirstSlug(universities[0].slug);
        }
      } catch (error) {
        console.error('Failed to fetch universities:', error);
        // Handle error, e.g., show a message to the user
      }
    };

    fetchUniversities();
  }, []);

  const getCountryImage = (countryName: string) => {
    switch (countryName) {
      case 'New Zealand':
        return USA;
      case 'Australia':
        return Aus;
      case 'UK':
        return Uk;
      case 'Canada':
        return Frn;
      default:
        return ''; // Default image path
    }
  };

  const handleViewAllClick = () => {
    // Navigate to university page with the slug of the first country
    if (firstSlug) {
      window.location.href = `/university?country=${firstSlug}`;
    }
  };

  const renderCountries = () => {
    return destination.map((country, index) => (
      // <div
      //   key={index}
      //   className={`w-full transform duration-200 ease-linear`}
      //   data-carousel-item={index === 0 ? 'active' : ''}
      // >
      <Country
        country={country.name}
        slug={country.slug}
        countryImage={getCountryImage(country.name)}
      />
      // </div>
    ));
  };

  return (
    <section className="my-5 ">
      <MaxWidthWrapper>
        <div className="flex justify-center flex-col mb-12">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-center text-dark-blue ">
            Where to Study? Checkout some of
          </h2>
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-center text-dark-blue">
            Popular Countries
          </h2>
        </div>

        <div className="relative  rounded-lg scrollbar-hidden">
          <div className="card-grid">{renderCountries()}</div>
        </div>

        {/* View All Countries button (conditionally rendered) */}
        {destination.length > 0 && (
          <div className="flex justify-center f">
            <button
              type="button"
              className="w-full md:w-52 h-12 px-6 text-primary-blue bg-secondary-yellow flex justify-center items-center rounded mt-5  text-base font-bold"
              onClick={handleViewAllClick}
            >
              View All Countries
            </button>
          </div>
        )}
      </MaxWidthWrapper>
    </section>
  );
};

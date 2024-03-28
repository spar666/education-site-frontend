'use client';
import React, { useState } from 'react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Country } from '../Country';
import USA from '../../../assets/images/usa.jpg';
import Aus from '../../../assets/images/australia.jpg';
import Uk from '../../../assets/images/uk.jpg';
import Frn from '../../../assets/images/france.jpg';
import CarouselControls from 'apps/student/components/CarouselControls';
import { cn } from 'libs/utils';

const Countries = [
  { country: 'USA', countryImage: USA, backgroundColor: 'cyan' },
  { country: 'UK', countryImage: Uk, backgroundColor: 'salmon' },
  { country: 'France', countryImage: Frn, backgroundColor: 'orange' },
  { country: 'Australia', countryImage: Aus, backgroundColor: 'skyblue' },
  { country: 'USA', countryImage: USA, backgroundColor: 'cyan' },
  { country: 'UK', countryImage: Uk, backgroundColor: 'salmon' },
  { country: 'France', countryImage: Frn, backgroundColor: 'orange' },
  { country: 'Australia', countryImage: Aus, backgroundColor: 'skyblue' },
];

export const UniversityPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = ({ direction }: any) => {
    const nextIndex =
      direction === 'next'
        ? (currentSlide + 3) % Countries.length
        : (currentSlide - 3 + Countries.length) % Countries.length;
    setCurrentSlide(nextIndex);
  };

  const currentItems = Countries.slice(currentSlide, currentSlide + 3);

  return (
    <section className="border-t border-gray-200">
      <MaxWidthWrapper className="py-20 relative">
        <div className="relative w-full">
          <div className="flex justify-between">
            <span className="font-bold tracking-tight text-gray-900">
              Popular Countries
            </span>
            <CarouselControls
              direction="horizontal"
              onSlideChange={handleSlideChange}
            />
          </div>

          <div className="relative h-40 mt-5 md:h-96 overflow-x-auto rounded-lg scrollbar-hidden">
            <div className="flex">
              {currentItems.map((country, index) => (
                <div
                  key={index}
                  className={`w-full transform duration-200 ease-linear`}
                  //   style={{ flex: '0 0 auto' }}
                  data-carousel-item={index === 0 ? 'active' : ''}
                >
                  <Country
                    country={country.country}
                    countryImage={country.countryImage}
                    backgroundColor={country.backgroundColor}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default UniversityPage;

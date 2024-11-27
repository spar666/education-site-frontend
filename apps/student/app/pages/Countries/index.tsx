'use client';
import React, { useState, useEffect } from 'react';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Country } from '../Country';
import USA from '../../../assets/images/usa.jpg';
import Aus from '../../../assets/images/australia.jpg';
import Uk from '../../../assets/images/uk.jpg';
import Frn from '../../../assets/images/france.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchAllUniversityByDestination } from '../../api/studyDestination';
import Slider from 'react-slick';
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
      }
    };

    fetchUniversities();
  }, []);

  const sliderSettings = {
    dots: true,
    slidesToShow: 3,
    arrows: false,
    slidesToScroll: 1,
    speed: 500,
    touchMove: true,
    cssEase: 'linear',

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 715,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

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
    if (firstSlug) {
      window.location.href = `/university/country/${firstSlug}`;
    }
  };

  return (
    <section className="my-5">
      <MaxWidthWrapper>
        <div className="flex justify-center flex-col mb-12">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-center text-dark-blue">
            Where to Study? Checkout some of
          </h2>
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-center text-dark-blue">
            Popular Countries
          </h2>
        </div>

        <div className="relative w-full mx-auto rounded-lg scrollbar-hidden">
          <Slider {...sliderSettings}>
            {destination.slice(0, 4).map((country, index) => (
              <div key={index} className="px-3">
                <Country
                  country={country.name}
                  slug={country.slug}
                  countryImage={getCountryImage(country.name)}
                />
              </div>
            ))}
          </Slider>
        </div>

        {destination.length > 0 && (
          <div className="flex justify-center">
            <button
              type="button"
              className="w-full md:w-52 h-12 px-6 text-primary-blue hover:bg-[#bf9100] bg-secondary-yellow flex justify-center items-center rounded mt-5 text-base font-bold"
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

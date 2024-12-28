'use client';
import CustomSearch from '../../../components/CustomSearch.tsx';
import student from '../../../assets/images/student2.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchAllBanner } from '../../api/Contents/Banner';
import { renderImage } from 'libs/services/helper';

interface IBanner {
  title: string;
  contents: string;
  coverImage: any;
}

export const HeroSection = () => {
  const [banner, setBanner] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetchAllBanner();
        setBanner(response.data.data);
      } catch (error) {
        console.error('Failed to fetch banner data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (banner.length === 0) {
    return <div>No data available</div>;
  }

  const firstBannner = banner[0];
  return (
    <>
      <div className="relative py-10 lg:py-20 bg-dark-blue w-full flex text-base flex-col lg:flex-row lg:justify-between items-center px-5 sm:px-10 md:px-14 lg:px-24">
        {/* Left Side: Text */}
        <div className="max-w-3xl lg:w-1/2 lg:pr-12 text-white mx-auto lg:pl-0 opacity-0 animate-fadeInUp">
          <h1 className="text-center lg:text-start mx-auto text-3xl sm:text-4xl lg:text-[3.1rem] !leading-tight font-bold tracking-tight">
            {firstBannner?.title} {firstBannner?.title}{' '}
            <span className="text-white">Education</span>.
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl max-w-prose text-center lg:text-start">
            <div
              className="text-base font-bold leading-1.5 mt-3"
              dangerouslySetInnerHTML={{
                __html: firstBannner.contents || '',
              }}
            ></div>
          </p>
          <button
            type="button"
            className="w-full md:w-52 h-12 px-6 text-dark-blue hover:bg-[#bf9100] bg-secondary-yellow flex justify-center items-center rounded mt-5 text-base font-bold transition-all duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Right Side: Image */}
        <div
          className="w-full lg:w-1/2 mt-8 lg:mt-0 flex hidden lg:block opacity-0 animate-fadeInUp"
          style={{
            background: 'inherit',
          }}
        >
          {/* Image with scale-up effect on hover */}
          <Image
            src={`${renderImage({
              imgPath: firstBannner.coverImage || student,
              size: 'lg',
            })}`}
            alt="Student"
            width={400}
            height={400}
            className="w-full object-contain transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      </div>

      {/* Centered CustomSearch */}
      <div className="flex justify-center md:justify-start mx-auto max-w-screen-lg px-4 lg:px-0 mt-[-60px] z-10 w-full m-5 lg:align-center">
        <CustomSearch />
      </div>
    </>
  );
};

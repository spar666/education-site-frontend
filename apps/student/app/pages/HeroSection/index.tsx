'use client';
import CustomSearch from '../../../components/CustomSearch.tsx';
import student from '../../../assets/images/student2.png';
import Image from 'next/image';

export const HeroSection = () => {
  return (
    <>
      <div className="relative py-10 lg:py-20  bg-dark-blue w-full flex  text-base flex-col lg:flex-row lg:justify-between items-center px-5 sm:px-10 md:px-14 lg:px-24">
        {/* Left Side: Text */}
        <div className="max-w-3xl lg:w-1/2 lg:pr-12 text-white mx-auto lg:pl-0">
          {/* Added padding on the left */}
          <h1 className="text-center lg:text-start mx-auto text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight">
            Your marketplace for high-quality{' '}
            <span className="text-white">Education</span>.
          </h1>
          <p className="mt-4 sm:mt-6 text-base  sm:text-lg lg:text-xl max-w-prose text-center lg:text-start">
            Start your journey to discover new horizons, expand your knowledge,
            and create a world of possibilities.
          </p>
          <button
            type="button"
            className="w-full md:w-52 h-12 px-6 text-dark-blue bg-secondary-yellow flex justify-center items-center rounded mt-5 text-base font-bold"
            //onClick={handleViewAllClick}
          >
            Learn More
          </button>
        </div>
        {/* Right Side: Image */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex ">
          {/* Added margin top for smaller screens */}
          <Image src={student} className="" alt="" />
        </div>
      </div>
      {/* Centered CustomSearch */}
      <div className="flex justify-center md:justify-start mx-auto max-w-screen-lg px-4 lg:px-0 mt-[-60px] z-10 w-full m-5 lg:align-center">
        <CustomSearch />
      </div>
    </>
  );
};

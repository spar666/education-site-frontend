'use client';

import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import React, { useEffect, useState } from 'react';
import student from '../../../assets/images/student2.png';
import Image from 'next/image';
import { fetchAllAboutUs } from '../../api/Contents/AboutUs';
import { renderImage } from 'libs/services/helper';

interface IAboutUs {
  title: string;
  contents: string;
  coverImage: any;
}

const About = () => {
  const [about, setAbout] = useState<IAboutUs[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await fetchAllAboutUs();
        setAbout(response.data.data); 
      } catch (error) {
        console.error('Failed to fetch about us data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (about.length === 0) {
    return <div>No data available</div>;
  }

  const firstAbout = about[0];

  return (
    <section className="my-10">
      <MaxWidthWrapper className="pb-10 lg:pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Section */}
          <div className="flex-1">
            <h2 className="text-xl sm:text-3xl font-bold italic tracking-tight text-dark-blue mb-4">
              About Us
            </h2>
            <h5 className="text-2xl font-bold text-gray-900 mb-6">
              {firstAbout.title}
            </h5>
            <p className="text-gray-600 leading-relaxed mb-6">
              <div
                className="text-base leading-1.5 mt-3"
                dangerouslySetInnerHTML={{
                  __html: firstAbout.contents || '',
                }}
              ></div>
            </p>

            {/* Core Strength Section */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-purple-100 text-center p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-700">15</h3>
                <p className="text-sm text-gray-700">Years Experience</p>
              </div>
              <div className="bg-yellow-100 text-center p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-yellow-700">100%</h3>
                <p className="text-sm text-gray-700">VISA Approved</p>
              </div>
              <div className="bg-pink-100 text-center p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-pink-700">96%</h3>
                <p className="text-sm text-gray-700">Admission Success</p>
              </div>
            </div>

            {/* Call to Action */}
            <button className="mt-8 px-6 py-2 bg-dark-blue text-white rounded-lg shadow hover:bg-blue-700">
              Get Free Consultation
            </button>
          </div>

          {/* Right Section */}
          <div className="flex-1">
            <div className="relative">
              <Image
                src={`${renderImage({
                  imgPath: firstAbout.coverImage || student,
                  size: 'lg',
                })}`}
                alt="About Us"
                height={400}
                width={400}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute top-0 right-0 bg-yellow-200 w-16 h-16 rounded-full transform translate-x-4 -translate-y-4"></div>
              <div className="absolute bottom-0 left-0 bg-purple-200 w-16 h-16 rounded-full transform -translate-x-4 translate-y-4"></div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default About;

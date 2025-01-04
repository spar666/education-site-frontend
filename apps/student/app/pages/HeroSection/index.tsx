'use client';
import { useEffect, useState } from 'react';
import { fetchAllBanner } from '../../api/Contents/Banner';
import { HeroContent } from './HeroContent';
import { HeroImage } from './HeroImage';
import { SearchSection } from './SearchSection';

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
    <section className="mx-auto">
      <div className="relative bg-dark-blue">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative  mx-8 px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className=" grid lg:grid-cols-2 gap-12 items-center">
            <HeroContent
              title={firstBannner.title}
              content={firstBannner.contents}
            />
            <HeroImage imagePath={firstBannner.coverImage} />
          </div>
        </div>
      </div>

      <SearchSection />
    </section>
  );
};

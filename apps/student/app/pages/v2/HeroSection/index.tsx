'use client';
import React, { useEffect, useState } from 'react';
import { SearchSection } from './SearchSection';
import { fetchAllBanner } from 'apps/student/app/api/Contents/Banner';

// Skeleton Loader Component
const BannerSkeleton: React.FC = () => {
  return (
    <div className="bg-blue-900 py-20 px-4">
      <div className="relative max-w-7xl mx-auto animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="h-12 lg:h-14 w-3/4 bg-blue-800 rounded mb-6" />
            <div className="space-y-3 mb-8">
              <div className="h-4 w-full bg-blue-800 rounded" />
              <div className="h-4 w-5/6 bg-blue-800 rounded" />
              <div className="h-4 w-2/3 bg-blue-800 rounded" />
            </div>
            <div className="h-12 w-48 bg-blue-800 rounded-lg" />
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-blue-800 rounded-2xl shadow-2xl" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
              >
                <div className="h-8 w-16 mx-auto bg-blue-800 rounded mb-2" />
                <div className="h-4 w-24 mx-auto rozpocząbg-blue-800 rounded" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

interface IBanner {
  title: string;
  contents: string;
  coverImage: any;
}

function Index() {
  const [banner, setBanner] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const stats = [
    { value: '15', label: 'Years Experience' },
    { value: '100%', label: 'VISA Approved' },
    { value: '96%', label: 'Admission Success' },
  ];

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
    return <BannerSkeleton />;
  }

  const firstBannner = banner[0];

  return (
    <section className="bg-blue-900 py-20 px-4">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {firstBannner?.title}
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              <div
                className="prose prose-lg text-white tracking-tight prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: firstBannner?.contents || '',
                }}
              />
            </p>
            <button className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Get Free Consultation
            </button>
          </div>
          <div className="relative">
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-50"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-50"></div>
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Students studying"
              className="rounded-2xl shadow-2xl relative z-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search section at the bottom */}
      <div className="mt-16">
        <SearchSection />
      </div>
    </section>
  );
}

export default Index;

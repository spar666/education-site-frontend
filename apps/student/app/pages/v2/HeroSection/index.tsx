'use client';
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchAllBanner } from 'apps/student/app/api/Contents/Banner';
import { renderImage } from 'libs/services/helper';
import Link from 'next/link';

const BannerSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-16 bg-gray-300 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
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

  const firstBanner = banner[0];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 pt-20 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full">
            <span className="text-sm font-medium text-cyan-600">🎓 Trusted by 1,000+ International Students</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-gray-900">Your Pathway to</span>
              <br />
              <span className="text-blue-600">Study</span>
              <span className="text-cyan-400">, Work & Life</span>
              <span className="text-gray-900"> in</span>
              <br />
              <span className="text-gray-900">Australia</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
              {firstBanner?.contents ? (
                <div dangerouslySetInnerHTML={{ __html: firstBanner.contents }} />
              ) : (
                "Expert guidance from course selection to visa success and beyond. We've helped thousands of students from South Asia achieve their Australian dream."
              )}
            </p>

            {/* Trust Indicators */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-base text-gray-700 font-medium">MARA Registered Migration Agents</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-base text-gray-700 font-medium">10+ Years Experience</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-base text-gray-700 font-medium">95% Visa Success Rate</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="https://calendly.com/studyandvisa-au" target="_blank" rel="noopener noreferrer">
                <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-base hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg flex items-center justify-center gap-2">
                  Book Your Free Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              <Link href="#resources">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-base hover:bg-gray-50 transition-all border-2 border-blue-600">
                  Download Free Guide
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative">
            {/* Success Stories Badge - Top Right */}
            <div className="absolute -top-4 -right-4 z-20 bg-white rounded-2xl p-4 shadow-xl border-4 border-white">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">1,000+</p>
                <p className="text-sm text-gray-600">Success Stories</p>
              </div>
            </div>

            {/* Countries Served Badge - Bottom Left */}
            <div className="absolute -bottom-4 left-4 z-20 bg-white rounded-2xl p-4 shadow-xl border-4 border-white">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">50+</p>
                <p className="text-sm text-gray-600">Countries Served</p>
              </div>
            </div>

            {/* Main image */}
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={
                  firstBanner?.coverImage
                    ? renderImage({ imgPath: firstBanner.coverImage, width: 800, height: 1000 })
                    : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                }
                alt="International students celebrating graduation in Australia"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Index;

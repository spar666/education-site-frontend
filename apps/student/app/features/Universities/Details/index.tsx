"use client";
import React, { useState, useEffect } from 'react';
import { IUniversity, Tab } from './types';
import { fetchUniversityData } from './services/mockApi';
import DetailBanner from './components/DetailBanner';
import Overview from './components/Overview';
import CourseList from './components/CourseList';
import Sidebar from './components/Sidebar';
import { Home, ChevronRight, MapPin, Globe, Star } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<IUniversity | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OVERVIEW);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchUniversityData();
        setData(result);
      } catch (error) {
        console.error("Failed to load university data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="h-96 bg-slate-200 animate-pulse w-full"></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-slate-200 w-1/3 rounded"></div>
              <div className="h-64 bg-slate-200 rounded-xl"></div>
              <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="h-40 bg-slate-200 rounded-xl"></div>
              <div className="h-40 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-12 text-center text-red-500">Failed to load university data.</div>;

  // Banner Content Component
  const BannerContent = () => (
    <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 font-serif">
            {data.universityName}
          </h1>
          <div className="flex items-center text-slate-700 mb-4 text-sm md:text-base">
            <MapPin className="w-5 h-5 mr-1.5 text-brand-600" />
            <span>{data.universityAddress}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.worldRanking && (
              <span className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full text-xs font-bold text-blue-800 border border-blue-100 uppercase tracking-wide">
                <Globe className="w-3 h-3 mr-1.5" />
                World Rank: #{data.worldRanking}
              </span>
            )}
            {data.isEnglishCourseAvailable && (
              <span className="inline-flex items-center bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 border border-emerald-100 uppercase tracking-wide">
                <Star className="w-3 h-3 mr-1.5" />
                English Available
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      <DetailBanner
        height="h-[400px] md:h-[500px]"
        imageUrl={data.universityImage}
        component={<BannerContent />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 py-6 overflow-x-auto">
          <a href="/" className="hover:text-brand-600 flex items-center gap-1 transition-colors"><Home className="w-4 h-4" /> Home</a>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <a href="#" className="hover:text-brand-600 transition-colors">Universities</a>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="font-medium text-slate-800 whitespace-nowrap">{data.universityName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6 sticky top-0 bg-slate-50 z-20 pt-2">
              <nav className="flex gap-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab(Tab.OVERVIEW)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-all relative
                    ${activeTab === Tab.OVERVIEW
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab(Tab.COURSES)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-all relative
                    ${activeTab === Tab.COURSES
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                  Courses
                  <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                    {data.courseSubject.length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === Tab.OVERVIEW ? (
                <Overview data={data} />
              ) : (
                <CourseList courses={data.courseSubject.map(cs => cs.course)} />
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <Sidebar data={data} />
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">

        </div>
      </footer>
    </div>
  );
};

export default App;

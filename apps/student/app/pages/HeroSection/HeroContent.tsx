'use client';

import { ArrowRight } from 'lucide-react';

interface HeroContentProps {
  title: string;
  content: string;
}

export const HeroContent = ({ title, content }: HeroContentProps) => (
  <div className="space-y-4 animate-fadeIn">
    <div className="space-y-4">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
        {title}{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-yellow to-yellow-400">
          Education
        </span>
      </h1>
      <div
        className="prose prose-lg  text-white tracking-tight prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: content || '',
        }}
      />
    </div>

    <button
      type="button"
      className="group inline-flex items-center px-6 py-3 text-dark-blue bg-secondary-yellow rounded-lg font-semibold shadow-lg hover:bg-[#bf9100] transition-all duration-300 transform hover:scale-105"
    >
      Learn More
      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
    </button>
  </div>
);

import { ArrowDownToLine, CheckCircle, Leaf } from 'lucide-react';
import Link from 'next/link';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import {
  Button,
  buttonVariants,
} from 'libs/ui-components/src/components/ui/button';

import { HeroSection } from './pages/HeroSection';
import Course from './pages/course/page';
import { UniversityPage } from './pages/Countries';
import BlogPage from './pages/Blogs';
import { FeaturedCourse } from './pages/featuredCourse';
import CustomSearch from '../components/CustomSearch.tsx';

export default async function Index() {
  return (
    <div className="min-h-screen bg-muted flex justify-center items-center flex-col gap-2 ">
      <HeroSection />
      <div className="px-5 sm:px-10 md:px-14 lg:px-24 w-full">
        <FeaturedCourse />
        <UniversityPage />
        <BlogPage />
      </div>
    </div>
  );
}

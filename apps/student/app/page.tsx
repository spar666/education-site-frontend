'use client';
import {
  ArrowDownToLine,
  CheckCircle,
  Leaf,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import {
  Button,
  buttonVariants,
} from 'libs/ui-components/src/components/ui/button';
import Recommendation from './pages/Recommendation/page';
import useUser from '../hook/useUser';
import Navbar from '../components/v2/Navbar';
import HeroSection from './pages/v2/HeroSection';
import FeaturedCourse from './pages/v2/featuredCourse';
import Services from './pages/v2/Services';
import Destination from './pages/v2/Destination';
import About from './pages/v2/About';
import Blogs from './pages/v2/Blogs';
import Faq from './pages/v2/Faq';
import Footer from '../components/v2/Footer';
import PopularDestination from './pages/v2/PopularDestination';

export default function Index() {
  const { isAuthenticated } = useUser();

  return (
    <div className="flex flex-col gap-2 relative min-h-screen bg-white overflow-x-hidden">
      {/* <Navbar /> */}
      <HeroSection />
      <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-5 md:px-10 lg:px-16 xl:px-24 overflow-hidden">
        {isAuthenticated && <Recommendation />}

        <FeaturedCourse />
        <PopularDestination />
        <Services />

        <About />
        <Blogs />
        <Faq />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

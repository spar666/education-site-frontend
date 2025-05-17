'use client';
import {
  ArrowDownToLine,
  CheckCircle,
  Leaf,
  MessageCircle,
} from 'lucide-react'; // Add MessageCircle for WhatsApp
import Link from 'next/link';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import {
  Button,
  buttonVariants,
} from 'libs/ui-components/src/components/ui/button';

// import { HeroSection } from './pages/HeroSection';
import Course from './pages/course/page';
import { UniversityPage } from './pages/Countries';
// import BlogPage from './pages/Blogs';
// import { FeaturedCourse } from './pages/featuredCourse';
import CustomSearch from '../components/CustomSearch.tsx';
// import About from './pages/About';
// import Services from './pages/Services';
// import FAQ from './pages/Faq';
// import { FloatingWhatsApp } from '../components/WhatApps';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
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
    // <main className="relative flex flex-col bg-gradient-to-b from-indigo-50 to-white">
    //   <Navbar />
    <div className="flex  flex-col gap-2 relative">
      <HeroSection />
      <div className="px-5 sm:px-10 md:px-14 lg:px-24 w-full">
        {isAuthenticated && <Recommendation />}

        <FeaturedCourse />
        <PopularDestination />
        <Services />
        {/* <UniversityPage /> */}
        {/* <Destination /> */}

        <About />
        <Blogs />
        <Faq />
      </div>

      {/* WhatsApp Icon */}

      {/* <FloatingWhatsApp
          phoneNumber="+61 466 658 522"
          accountName="StudyAndVisa"
          allowEsc
          notification
          notificationSound
        /> */}
    </div>
    // <Footer />
    // </main>
  );
}

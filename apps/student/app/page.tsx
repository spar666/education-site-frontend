'use client';
import React, { Suspense } from 'react';
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
import HowItWorks from './pages/v2/HowItWorks';
import SuccessStories from './pages/v2/SuccessStories';
import FreeResources from './pages/v2/FreeResources';
import Contact from './pages/v2/Contact';
import Destination from './pages/v2/Destination';
import About from './pages/v2/About';
import Blogs from './pages/v2/Blogs';
import Faq from './pages/v2/Faq';
import Footer from '../components/v2/Footer';
import PopularDestination from './pages/v2/PopularDestination';

export default function Index() {
  const { isAuthenticated } = useUser();

  return (
    <div className="relative min-h-screen bg-white">
      {/* Hero Section - now includes stats and contact */}
      <HeroSection />
      
      {/* Services Section */}
      <Services />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Featured Courses */}
      <FeaturedCourse />
      
      {/* Success Stories */}
      <SuccessStories />
      
      {/* Free Resources */}
      <FreeResources />
      
      {/* Contact / Book Consultation */}
      <Suspense fallback={<div className="py-20 text-center">Loading contact form...</div>}>
        <Contact />
      </Suspense>
    </div>
  );
}

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
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="relative bg-white">
        <div className="container-modern">
          {isAuthenticated && <Recommendation />}
          
          <FeaturedCourse />
          <PopularDestination />
          <Services />
          <About />
          <Blogs />
          <Faq />
        </div>
      </div>
    </div>
  );
}

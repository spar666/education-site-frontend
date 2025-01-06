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

import { HeroSection } from './pages/HeroSection';
import Course from './pages/course/page';
import { UniversityPage } from './pages/Countries';
import BlogPage from './pages/Blogs';
import { FeaturedCourse } from './pages/featuredCourse';
import CustomSearch from '../components/CustomSearch.tsx';
import About from './pages/About';
import Services from './pages/Services';
import FAQ from './pages/Faq';

export default async function Index() {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center flex-col gap-2 relative">
      <HeroSection />
      <div className="px-5 sm:px-10 md:px-14 lg:px-24 w-full">
        <FeaturedCourse />
        <Services />
        <UniversityPage />
        <About />
        <BlogPage />
        <FAQ />
      </div>

      {/* WhatsApp Icon */}
      <Link
        href="https://wa.me/+9779860409629"
        target="_blank"
        className="fixed bottom-5 right-5 bg-navy-blue text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-all duration-300 group"
      >
        <div className="relative">
          {/* Animated Pulse Effect */}
          <span className="absolute inset-0 w-full h-full rounded-full bg-green-500 opacity-70 animate-ping"></span>
          {/* WhatsApp Icon */}
          <MessageCircle
            size={28}
            className="relative z-10 group-hover:scale-110 transform transition-transform duration-200"
          />
        </div>
      </Link>
    </div>
  );
}

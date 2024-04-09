'use client';
import { usePathname } from 'next/navigation';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Icons } from './Icons';
import Link from 'next/link';
import { Button } from 'libs/ui-components/src/components/ui/button';
import { Input } from 'libs/ui-components/src/components/ui/input';
import { FaceIcon, InstagramLogoIcon } from '@radix-ui/react-icons';
import { Facebook, FacebookIcon, Instagram, Mail } from 'lucide-react';

const MainMenu = () => (
  <div className="flex flex-col space-y-4">
    <Link href="#" className="text-sm text-navy-blue hover:text-gray-600">
      Find Course
    </Link>
    <Link href="#" className="text-sm text-navy-blue hover:text-gray-600">
      Study Destination
    </Link>
    <Link href="#" className="text-sm text-navy-blue hover:text-gray-600">
      Blog
    </Link>
  </div>
);

const ContactDetails = () => (
  <div className="text-center">
    <small>
      Be the first one to know about opportunities, offers, and events
    </small>
  </div>
);

const NewsletterForm = () => (
  <div className="text-center">
    <div className="flex flex-col bg-white md:flex justify-between   rounded">
      <div className="mb-3">
        <small>
          Be the first one to know about opportunities, offers, and events
        </small>
      </div>
      <div className="newsletter buttonInside relative">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" placeholder="Email" />
          <Button type="submit">Subscribe</Button>
        </div>
      </div>
    </div>
  </div>
);

const Footer = () => {
  const pathname = usePathname();
  const pathsToMinimize = ['/verify-email', '/sign-up', '/sign-in'];

  return (
    <footer className="bg-light-gray">
      <MaxWidthWrapper>
        <div className="border-t border-gray-200">
          {pathsToMinimize.includes(pathname) ? null : (
            <div className="relative flex flex-col text-dark-blue justify-between sm:flex-row px-6 py-6 sm:py-8 lg:mt-0">
              <div className="flex flex-col  justify-between pr-8">
                <span className="font-bold tracking-tight text-dark-blue">
                  Useful Links
                </span>
                <MainMenu />
              </div>

              {/* Middle part containing contact details */}
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-dark-blue">
                  Contact Information
                </span>
                <ContactDetails />
              </div>

              {/* Right part containing newsletter form */}
              <div className="flex flex-col  ">
                <span className="font-bold tracking-tight text-dark-blue">
                  Subscribe to our newsletter
                </span>
                <NewsletterForm />
              </div>
            </div>
          )}
        </div>

        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-navy-blue">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link
                href="#"
                className="text-sm text-navy-blue hover:text-gray-600"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="#"
                className="text-sm text-navy-blue hover:text-gray-600"
              >
                <Instagram />
              </Link>
              <Link
                href="#"
                className="text-sm text-navy-blue hover:text-gray-600"
              >
                <Mail />
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;

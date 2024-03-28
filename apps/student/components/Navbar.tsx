'use client';
import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavItems from './NavItems';
import MobileNav from './MobileNav';
import { Icons } from './Icons';
import { GitCompare, Heart, Search, UserRoundPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomModal from './CustomModal';
const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHeartClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="w-full bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="flex h-16 items-center">
            <MobileNav />
            <div className="ml-4 flex lg:ml-0">
              <Link href="/">
                <Icons.logo className="h-10 w-10" color="bg-electric-violet" />
              </Link>
            </div>
            <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
              <NavItems />
            </div>
            <div className="ml-auto flex items-center">
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                <Link href="/sign-in">
                  <Search />
                </Link>
                <Heart onClick={handleHeartClick} />{' '}
                {/* Handle click event here */}
                <Link href="/sign-in">
                  <UserRoundPlus />
                </Link>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
      <CustomModal visible={isModalOpen} onClose={handleCloseModal} />{' '}
      {/* Pass props to Modal */}
    </div>
  );
};

export default Navbar;

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
    <nav className="bg-white text-dark-blue w-full inset-x-0 h-16">
      <MaxWidthWrapper className="relative flex justify-between items-center h-full">
        <div className="flex items-center">
          <MobileNav />
          <Link href="/">
            <Icons.logo className="h-10 w-10 text-electric-violet" />
          </Link>
          <div className="hidden ml-8 lg:flex lg:self-stretch">
            <NavItems />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="lg:hidden flex justify-between items-center space-x-6">
            <Search />
            <Heart onClick={handleHeartClick} />
            <Link href="/sign-in">
              <button
                type="button"
                className="w-full md:w-20 h-10 px-4 py-2 bg-dark-blue text-white flex text-center rounded"
              >
                SignIn
              </button>
            </Link>
          </div>
          <div className="hidden  flex-end lg:flex justify-between items-center space-x-6">
            {/* <Search /> */}
            <Heart onClick={handleHeartClick} />
            <Link href="/sign-in">
              <button
                type="button"
                className="w-full font-['Open_Sans'] md:w-20 h-10 px-4 py-2 bg-dark-blue text-white flex text-center rounded"
              >
                SignIn
              </button>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
      <CustomModal visible={isModalOpen} onClose={handleCloseModal} />
    </nav>
  );
};

export default Navbar;

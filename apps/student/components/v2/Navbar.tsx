'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import useUser from 'apps/student/hook/useUser';
import Logo from '../../assets/Logo/Logostudyvisa.png';

interface NavLink {
  name: string;
  href: string;
}

interface User {
  firstName: string;
}

interface UserHook {
  user: User | null;
  isAuthenticated: boolean;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Study Destinations', href: '/destinations' },
  { name: 'Find Course', href: '/courses' },
  { name: 'Services', href: '/#services' },
  { name: 'About Us', href: '/about' },
  { name: 'Our Blogs', href: '/blog' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useUser() as UserHook;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteCookie('accessToken', { path: '/' });
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-blue-600">StudyAndVisa</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              
              return link.href.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-base font-normal transition-colors duration-200 ${
                    active ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-normal transition-colors duration-200 ${
                    active ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Book Free Consultation Button */}
            <a href="https://calendly.com/studyandvisa-au" target="_blank" rel="noopener noreferrer">
              <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md whitespace-nowrap">
                Book Free Consultation
              </button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            {navLinks.map((link) =>
              link.href.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}
            
            {/* Mobile CTA Button */}
            <a href="https://calendly.com/studyandvisa-au" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all">
                Book Free Consultation
              </button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);

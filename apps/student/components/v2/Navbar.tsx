'use client';
import React, { useState, useEffect } from 'react';
import {
  CircleUserRound,
  Heart,
  Menu,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import Logo from '../../assets/Logo/Logo.png';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import useUser from 'apps/student/hook/useUser';
import { StudyLevelsSection } from '../StudyLevelsSection';
import { CoursesGrid } from '../CoursesGrid';
import { DestinationList } from '../DestinationList';
import { fetchStudyLevels } from 'apps/student/app/api/studyLevel';
import { fetchCourses } from 'apps/student/app/api/courses';
import { fetchAllUniversityByDestination } from 'apps/student/app/api/studyDestination';

interface NavLink {
  name: string;
  href: string;
  isDropdown?: boolean;
}

interface User {
  firstName: string;
}

interface UserHook {
  user: User | null;
  isAuthenticated: boolean;
}

const navLinks: NavLink[] = [
  { name: 'Study Destination', href: '#destinations', isDropdown: true },
  { name: 'Find Course', href: '#courses', isDropdown: true },
  { name: 'Our Blogs', href: '/blog' },
];

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [studyLevels, setStudyLevels] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const router = useRouter();
  const { user, isAuthenticated } = useUser() as UserHook;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levels, coursesData, destinationsData] = await Promise.all([
          fetchStudyLevels(),
          fetchCourses(),
          fetchAllUniversityByDestination(),
        ]);

        setStudyLevels(levels);
        setCourses(coursesData);
        setDestinations(destinationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
        setActiveDropdown(null);
      }
      if (!target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    deleteCookie('accessToken', { path: '/' });
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const toggleNavDropdown = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const renderAuthSection = (): JSX.Element => {
    if (isAuthenticated && user) {
      return (
        <div className="relative">
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <CircleUserRound className="h-5 w-5" />
            <span className="font-medium">{user.firstName}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 dropdown-container border border-gray-100">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span>Dashboard</span>
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="space-x-3">
        <Link href="/auth/sign-in">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Sign In
          </button>
        </Link>
      </div>
    );
  };

  const renderDesktopNav = () => {
    return (
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <div key={link.name} className="relative dropdown-container">
            {link.isDropdown ? (
              <>
                <button
                  type="button"
                  onClick={(e) => toggleNavDropdown(link.name, e)}
                  className={`flex items-center space-x-1 text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors ${
                    activeDropdown === link.name ? 'text-blue-600' : ''
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === link.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeDropdown === link.name && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[800px] bg-white rounded-lg shadow-xl py-5 px-6 z-50 border border-gray-100">
                    {link.name === 'Study Destination' ? (
                      <DestinationList
                        destinations={destinations}
                        onClose={() => setActiveDropdown(null)}
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-8">
                        <StudyLevelsSection
                          studyLevels={studyLevels}
                          onClose={() => setActiveDropdown(null)}
                        />
                        <CoursesGrid
                          courses={courses}
                          onClose={() => setActiveDropdown(null)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={link.href}
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            )}
          </div>
        ))}
        <button
          type="button"
          className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Add your heart icon functionality here
          }}
        >
          <Heart className="h-5 w-5" />
        </button>
        {renderAuthSection()}
      </div>
    );
  };

  const renderMobileMenu = () => {
    return (
      <div
        className={`md:hidden py-4 space-y-1 mobile-menu-container ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {navLinks.map((link) => (
          <div key={link.name} className="relative">
            {link.isDropdown ? (
              <>
                <button
                  type="button"
                  onClick={(e) => toggleNavDropdown(link.name, e)}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="font-medium">{link.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === link.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeDropdown === link.name && (
                  <div className="pl-4 mt-1 space-y-1">
                    {link.name === 'Study Destination' ? (
                      destinations.map((item) => (
                        <Link
                          key={item.id}
                          href={`/university/country/${item.slug}`}
                          className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => {
                            setActiveDropdown(null);
                            setIsMenuOpen(false);
                          }}
                        >
                          {item.name}
                        </Link>
                      ))
                    ) : (
                      <>
                        <div className="px-4 py-2 font-medium text-gray-500 text-sm">
                          STUDY LEVELS
                        </div>
                        {studyLevels.map((level) => (
                          <Link
                            key={level.id}
                            href={`/course/degree/${level.slug}`}
                            className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => {
                              setActiveDropdown(null);
                              setIsMenuOpen(false);
                            }}
                          >
                            {level.name}
                          </Link>
                        ))}
                        <div className="px-4 py-2 font-medium text-gray-500 text-sm mt-2">
                          COURSES
                        </div>
                        {courses.map((course) => (
                          <Link
                            key={course.id}
                            href={`/subject/${course.slug}`}
                            className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => {
                              setActiveDropdown(null);
                              setIsMenuOpen(false);
                            }}
                          >
                            {course.courseName}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={link.href}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            )}
          </div>
        ))}
        {isAuthenticated ? (
          <>
            <Link
              href="/dashboard"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/auth/sign-in"
            className="block px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={Logo}
                width={40}
                height={40}
                alt="Logo"
                priority
                className="hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {renderDesktopNav()}

          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {renderMobileMenu()}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);

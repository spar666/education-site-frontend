'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  CircleUserRound,
  Heart,
  Menu,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import useUser from 'apps/student/hook/useUser';
import Logo from '../../assets/Logo/Logo.png';
import { fetchStudyLevels } from 'apps/student/app/api/studyLevel';
import { fetchAllUniversityByDestination } from 'apps/student/app/api/studyDestination';

interface Course {
  courseName: string;
  slug: string;
  courseCategory: {
    id: string;
    courseCategory: string;
  } | null;
}

interface StudyLevel {
  id: string;
  name: string;
  slug: string;
  course: Course[];
}

interface Destination {
  id: string;
  name: string;
  slug: string;
}

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

const commonCategories = [
  'Health and medicine',
  'Business studies',
  'Applied and pure sciences',
  'Social studies and media',
  'Engineering and tech',
  'Computer science and IT',
];

const buildSearchUrl = (
  level: string = '',
  course: string = '',
  location: string = ''
) => {
  return `/search?level=${level}&course=${course}&location=${location}`;
};

const FindCourseSection: React.FC<{
  onClose: () => void;
  studyLevels: StudyLevel[];
}> = ({ onClose, studyLevels }) => {
  const processCategories = (levels: StudyLevel[]) => {
    const categoriesMap = new Map<string, string>();
    levels.forEach((level) => {
      level.course.forEach((course) => {
        const categoryName =
          course.courseCategory?.courseCategory || 'Other Courses';
        if (!categoriesMap.has(categoryName)) {
          categoriesMap.set(categoryName, course.slug);
        }
      });
    });
    return Array.from(categoriesMap.entries()).map(([name, slug]) => ({
      name,
      slug,
    }));
  };

  const sortCategories = (categories: { name: string; slug: string }[]) => {
    return [...categories].sort((a, b) => {
      const aIndex = commonCategories.findIndex((cat) =>
        a.name.toLowerCase().includes(cat.toLowerCase())
      );
      const bIndex = commonCategories.findIndex((cat) =>
        b.name.toLowerCase().includes(cat.toLowerCase())
      );

      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
      if (aIndex >= 0) return -1;
      if (bIndex >= 0) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const postgraduateLevels = studyLevels.filter((level) =>
    /postgrad|doctoral/i.test(level.name)
  );
  const undergraduateLevels = studyLevels.filter((level) =>
    /undergrad/i.test(level.name)
  );

  const postgraduateCategories = sortCategories(
    processCategories(postgraduateLevels)
  );
  const undergraduateCategories = sortCategories(
    processCategories(undergraduateLevels)
  );

  return (
    <div className="grid grid-cols-2 gap-8 p-6">
      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          POSTGRADUATE COURSES
        </h3>
        {postgraduateCategories.length > 0 ? (
          <ul className="space-y-3">
            {postgraduateCategories.map((category) => (
              <li key={category.name}>
                <Link
                  href={buildSearchUrl('', '', '')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={buildSearchUrl('postgraduate', '', '')}
                className="text-blue-600 font-medium hover:underline flex items-center mt-4"
                onClick={onClose}
              >
                Explore all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            No postgraduate courses available
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          UNDERGRADUATE COURSES
        </h3>
        {undergraduateCategories.length > 0 ? (
          <ul className="space-y-3">
            {undergraduateCategories.map((category) => (
              <li key={category.name}>
                <Link
                  href={buildSearchUrl('undergraduate', category.slug, '')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={buildSearchUrl('undergraduate', '', '')}
                className="text-blue-600 font-medium hover:underline flex items-center mt-4"
                onClick={onClose}
              >
                Explore all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            No undergraduate courses available
          </p>
        )}
      </div>

      <div className="col-span-2 pt-4 border-t border-gray-100">
        <Link
          href="/how-to-choose-course"
          className="text-blue-600 font-medium hover:underline flex items-center"
          onClick={onClose}
        >
          How to choose a course <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

const DestinationList: React.FC<{
  destinations: Destination[];
  onClose: () => void;
}> = ({ destinations, onClose }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <Link
          key={destination.id}
          href={buildSearchUrl('', '', destination.slug)}
          className="text-gray-700 hover:text-blue-600 transition-colors"
          onClick={onClose}
        >
          {destination.name}
        </Link>
      ))}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useUser() as UserHook;

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        const [levels, destinationsData] = await Promise.all([
          fetchStudyLevels(),
          fetchAllUniversityByDestination(),
        ]);
        setStudyLevels(levels);
        setDestinations(destinationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      deleteCookie('accessToken', { path: '/' });
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
      router.push('/');
    },
    [router]
  );

  const toggleDropdown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDropdownOpen((prev) => !prev);
    },
    []
  );

  const toggleMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleNavDropdown = useCallback((name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveDropdown((prev) => (prev === name ? null : name));
  }, []);

  const renderAuthSection = () => {
    if (!isClient) return <div className="w-24 h-10" />;

    if (isAuthenticated && user) {
      return (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <CircleUserRound className="h-5 w-5" />
            <span className="font-medium">{user.firstName}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
              <Link
                href="/auth/profile"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span>Profile</span>
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </Link>
              <button
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
      <Link href="/auth/sign-in">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Sign In
        </button>
      </Link>
    );
  };

  const renderDesktopNav = () => (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => (
        <div key={link.name} className="relative">
          {link.isDropdown ? (
            <>
              <button
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
                    <FindCourseSection
                      onClose={() => setActiveDropdown(null)}
                      studyLevels={studyLevels}
                    />
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
      <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
        <Heart className="h-5 w-5" />
      </button>
      {renderAuthSection()}
    </div>
  );

  const renderMobileMenu = () => {
    if (!isClient) return null;

    return (
      <div
        className={`md:hidden py-4 space-y-1 ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        {navLinks.map((link) => (
          <div key={link.name} className="relative">
            {link.isDropdown ? (
              <>
                <button
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
                          href={buildSearchUrl('', '', item.slug)}
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
                      <FindCourseSection
                        onClose={() => {
                          setActiveDropdown(null);
                          setIsMenuOpen(false);
                        }}
                        studyLevels={studyLevels}
                      />
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
              href="/auth/profile"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
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

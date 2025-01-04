'use client';

import { MENU_CATEGORIES } from '../config/index';
import { Button } from '../../../libs/ui-components/src/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../libs/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchStudyLevels } from '../app/api/studyLevel';
import { fetchCourses } from '../app/api/courses';
import { fetchAllUniversityByDestination } from '../app/api/studyDestination';
import { useRouter } from 'next/navigation';
import { DestinationList } from './DestinationList';
import { StudyLevelsSection } from './StudyLevelsSection';
import { CoursesGrid } from './CoursesGrid';

type Category = (typeof MENU_CATEGORIES)[number];

interface StudyLevel {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  universities: {
    id: string;
    universityName: string;
    slug: string;
  };
}

interface Course {
  id: string;
  courseName: string;
  slug: string;
}

interface NavItemProps {
  category: Category;
  handleOpen: () => void;
  close: () => void;
  isCourse: boolean;
  isDestination: boolean;
  isAnyOpen: boolean;
}

const NavItem = ({
  isAnyOpen,
  category,
  handleOpen,
  close,
  isCourse,
  isDestination,
}: NavItemProps) => {
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [destination, setDestination] = useState<Destination[]>([]);
  const router = useRouter();

  const handleRedirect = () => {
    if (category.label === 'Our Blogs') {
      router.push('/blog'); // Ensure the route is correct
    } else {
      handleOpen();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isCourse) {
          const [levelsData, coursesData] = await Promise.all([
            fetchStudyLevels(),
            fetchCourses(),
          ]);
          setStudyLevels(levelsData);
          setCourses(coursesData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Handle error
      }
    };

    if (isCourse && studyLevels.length === 0) {
      fetchData();
    }
  }, [isCourse]);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        if (isDestination) {
          const [countryData] = await Promise.all([
            fetchAllUniversityByDestination(),
          ]);
          setDestination(countryData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Handle error
      }
    };

    if (isDestination && destination.length === 0) {
      fetchDestination();
    }
  }, [isDestination]);
  return (
    <div className="flex z-20">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5 text-md"
          onClick={handleRedirect}
          variant={
            isCourse ? 'secondary' : isDestination ? 'secondary' : 'ghost'
          }
        >
          {category.label}
          {category.label !== 'Our Blogs' && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-all text-muted-foreground text-dark-navy',
                {
                  '-rotate-180': isCourse && !isDestination,
                  'rotate-180': !isCourse && isDestination,
                }
              )}
            />
          )}
        </Button>
      </div>
      {/* if find course open */}
      {isCourse && (
        <div
          onClick={() => close()}
          className={cn(
            'absolute inset-x-0 top-full text-sm text-muted-foreground overflow-y-auto flex items-center justify-center',
            { 'animate-in fade-in-10 slide-in-from-top-5': !isAnyOpen }
          )}
        >
          <div className="relative bg-white w-full">
            <div className="mx-auto">
              <div className="flex justify-between items-start gap-10 pb-5">
                <StudyLevelsSection studyLevels={studyLevels} onClose={close} />
                <CoursesGrid courses={courses} onClose={close} />
              </div>
            </div>
          </div>
        </div>
      )}

      {isDestination && (
        <div
          onClick={() => close()}
          className={cn(
            'absolute inset-x-0 top-full text-sm text-muted-foreground overflow-y-auto max-h-60',
            { 'animate-in fade-in-10 slide-in-from-top-5': !isAnyOpen }
          )}
        >
          <div
            className="absolute inset-0 top-1/2 bg-white shadow"
            aria-hidden="true"
          />
          <DestinationList destinations={destination} onClose={close} />
        </div>
      )}
    </div>
  );
};

export default NavItem;

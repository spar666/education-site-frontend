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
          onClick={handleOpen}
          variant={
            isCourse ? 'secondary' : isDestination ? 'secondary' : 'ghost'
          }
        >
          {category.label}
          {!(category.label === 'Our Blogs') && (
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
            'absolute inset-x-0 top-full text-sm text-muted-foreground overflow-y-auto  flex items-center justify-center ', // Adjust max-height as needed
            {
              'animate-in fade-in-10 slide-in-from-top-5': !isAnyOpen,
            }
          )}
        >
          <div className="relative bg-white w-full">
            <div className=" max-w-[800px] mx-auto">
              <div className="flex justify-between items-start gap-10 pb-5">
                <div>
                  <span className="block font-bold text-gray-900 pb-2">
                    Study Level
                  </span>
                  <div className="flex flex-col">
                    {studyLevels?.map((item) => (
                      <div
                        onClick={() => close}
                        key={item?.name}
                        className="group relative text-base sm:text-sm"
                      >
                        <Link
                          href={`/course?degree=${item?.slug}`}
                          className="mt-2 block font-small  font-[quicksand]"
                        >
                          {item?.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block font-bold text-gray-900 pb-2 ">
                    Courses
                  </span>
                  <div className="flex items-start gap-10 mt-2 ">
                    {courses &&
                      Array(Math.ceil(courses.length / 3))
                        .fill(3)
                        .map((_, columnIndex) => (
                          <div key={columnIndex} className="w-1/3 gap-[12rem]">
                            {courses
                              .slice(columnIndex * 3, columnIndex * 3 + 3)
                              .map((course, index) => (
                                <div
                                  onClick={() => close}
                                  key={course.slug}
                                  className={`group relative text-base sm:text-sm font-[quicksand] ${
                                    index > 0 ? 'mt-2' : ''
                                  }`}
                                >
                                  <Link
                                    href={`/subject?subjectName=${course.slug}`}
                                    className="block font-small text-blue-900"
                                    style={{ width: 'max-content' }}
                                  >
                                    {course.courseName}
                                  </Link>
                                </div>
                              ))}
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDestination && (
        <div
          onClick={() => close()}
          className={cn(
            'absolute inset-x-0 top-full text-sm text-muted-foreground overflow-y-auto max-h-60', // Adjust max-height as needed
            {
              'animate-in fade-in-10 slide-in-from-top-5': !isAnyOpen,
            }
          )}
        >
          <div
            className="absolute inset-0 top-1/2 bg-white shadow"
            aria-hidden="true"
          />

          <div className="relative bg-white">
            <div className=" max-w-[800px] mx-auto">
              <div className="flex justify-between items-center gap-4 pb-5">
                {destination?.map((dest: Destination) => (
                  <div key={dest.id}>
                    <span className="block font-bold text-gray-900 text-center">
                      {dest.name}
                    </span>
                    <div className="flex flex-col">
                      <Link
                        href={`/university?country=${dest.slug}`}
                        className="mt-1 block font-small text-blue-900"
                      >
                        Universities in {dest.name}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItem;

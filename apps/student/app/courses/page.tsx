'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, GraduationCap, Clock, DollarSign, BookOpen, ArrowRight, X, MapPin } from 'lucide-react';
import Link from 'next/link';
import { fetchStudyLevels } from 'apps/student/app/api/studyLevel';
import { fetchCourseCategories, fetchCategoriesWithCourses, fetchPublicCourses } from 'apps/student/app/api/courses';
import { search } from 'apps/student/app/api/search';

// --- Interfaces ---

interface CourseCategory {
  id: string;
  courseCategory: string;
  slug: string;
  courses?: Course[];
  courseCount?: number;
}

interface Course {
  id: string;
  courseName: string;
  slug: string;
  courseCategory: {
    id: string;
    courseCategory: string;
  } | null;
  // Assuming the API might return university data inside course, or we link it later
  description?: string;
}

interface StudyLevel {
  id: string;
  name: string;
  slug: string;
  course: Course[];
}

interface University {
  _id: string;
  id?: string;
  universityName: string;
  slug: string;
  description?: string;
  destination?: {
    name: string;
  };
}

// --- Constants & Helpers ---

// Tailwind doesn't support dynamic string interpolation for classes (e.g., bg-${color}-50)
// unless safelisted. Using a map is the safe approach.
const CATEGORY_STYLES = [
  { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
  { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' },
  { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-600' },
  { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-600' },
  { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'text-pink-600' },
  { bg: 'bg-cyan-50', text: 'text-cyan-600', icon: 'text-cyan-600' },
];

function CoursesPage() {
  // --- State ---
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search Results (API)
  const [universityResults, setUniversityResults] = useState<University[]>([]);

  // --- Data Fetching ---

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levels, categories, courses] = await Promise.all([
          fetchStudyLevels(),
          fetchCourseCategories(),
          fetchPublicCourses()
        ]);
        
        setStudyLevels(levels || []);
        setCourseCategories(categories || []);
        setAllCourses(courses || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Search Logic (Debounced) ---

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        performUniversitySearch(searchTerm);
      } else {
        setUniversityResults([]);
        setIsSearching(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const performUniversitySearch = async (term: string) => {
    setIsSearching(true);
    try {
      // Assuming this API finds universities based on the term
      const results = await search({
        courseCategory: term, // Or generic query if API supports it
        limit: 12,
      });
      setUniversityResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
      setUniversityResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --- Filtering Logic (Client Side) ---

  const filteredCourses = useMemo(() => {
    let result = allCourses;

    // 1. Filter by Level
    // Since 'Course' object might not have level ID directly, we check if the course exists in the selected StudyLevel's course list
    if (selectedLevel !== 'all') {
      const activeLevel = studyLevels.find(l => l.slug === selectedLevel);
      if (activeLevel && activeLevel.course) {
        const validCourseIds = new Set(activeLevel.course.map(c => c.id));
        result = result.filter(c => validCourseIds.has(c.id));
      }
    }

    // 2. Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(course => 
        course.courseCategory?.courseCategory === selectedCategory
      );
    }

    // 3. Filter by Search Term (Client side course search)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.courseName.toLowerCase().includes(lowerTerm) || 
        course.courseCategory?.courseCategory.toLowerCase().includes(lowerTerm)
      );
    }

    return result;
  }, [allCourses, studyLevels, selectedLevel, selectedCategory, searchTerm]);

  // --- Stats Calculation ---

  const getCategoryCourseCount = (categoryName: string) => {
    return allCourses.filter(course => 
      course.courseCategory?.courseCategory === categoryName
    ).length;
  };

  const clearFilters = () => {
    setSelectedLevel('all');
    setSelectedCategory('all');
    setSearchTerm('');
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect <span className="text-blue-600">Course</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8">
              Explore {allCourses.length > 0 ? `${allCourses.length}+` : 'hundreds of'} courses across Australian universities and find the program that matches your career goals.
            </p>
          </div>

          {/* Search Bar Component */}
          <div className="max-w-4xl mx-auto z-10 relative">
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, categories, or universities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap border ${
                    showFilters || selectedCategory !== 'all' || selectedLevel !== 'all'
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {/* Expandable Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Study Level</label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        <option value="all">All Levels</option>
                        {studyLevels.map((level) => (
                          <option key={level.id} value={level.slug}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        <option value="all">All Categories</option>
                        {courseCategories.map((cat) => (
                          <option key={cat.id} value={cat.courseCategory}>
                            {cat.courseCategory}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                     <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- SEARCH RESULTS (UNIVERSITIES) --- */}
      {searchTerm && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              University Results
            </h2>

            {isSearching ? (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Searching universities...
              </div>
            ) : universityResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universityResults.slice(0, 6).map((uni) => (
                  <Link key={uni._id || uni.id} href={`/university/details?uni=${uni.slug}`}>
                    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {uni.universityName}
                      </h3>
                      {uni.destination?.name && (
                         <div className="flex items-center text-sm text-gray-500 mb-2">
                           <MapPin className="w-4 h-4 mr-1" /> {uni.destination.name}
                         </div>
                      )}
                      <div className="text-xs font-semibold text-blue-600 flex items-center mt-3">
                        View Profile <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific universities found matching "{searchTerm}". Check the courses below.</p>
            )}
          </div>
        </section>
      )}

      {/* --- FILTERED COURSES LIST --- */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {searchTerm ? 'Matching Courses' : 'Available Courses'}
              </h2>
              <p className="text-gray-600">
                Showing {filteredCourses.length} results
                {selectedCategory !== 'all' && <span className="font-medium text-blue-600"> in {selectedCategory}</span>}
                {selectedLevel !== 'all' && <span className="font-medium text-blue-600"> ({studyLevels.find(l => l.slug === selectedLevel)?.name})</span>}
              </p>
            </div>
          </div>

          {loading ? (
             <div className="text-center py-20 text-gray-500">Loading courses...</div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.slice(0, searchTerm ? 12 : 9).map((course) => (
                <Link key={course.id} href={`/course/details/${course.slug}`}>
                  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all h-full flex flex-col justify-between group">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.courseCategory?.courseCategory || 'Course'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.courseName}
                      </h3>
                      {/* Placeholder for university name if available in course object */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span>University Program</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                      <span className="text-gray-500">View Details</span>
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any courses matching your filters.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
          
          {filteredCourses.length > 9 && (
            <div className="mt-10 text-center">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                Load More Courses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- CATEGORIES GRID (Only show if not searching deeply) --- */}
      {!searchTerm && selectedCategory === 'all' && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
              <p className="text-gray-600">Explore our most requested fields of study</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courseCategories.slice(0, 6).map((category, index) => {
                // Get safe style from map
                const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
                const count = getCategoryCourseCount(category.courseCategory);

                return (
                  <Link key={category.id} href={`/search?courseCategory=${category.courseCategory}`}>
                    <div className="group h-full bg-white rounded-2xl p-8 border-2 border-gray-50 hover:border-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <div className={`inline-flex p-4 rounded-xl mb-6 ${style.bg} ${style.icon}`}>
                        <BookOpen className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {category.courseCategory}
                      </h3>
                      
                      <p className="text-gray-500 mb-6">
                        Explore {count} courses offered by top universities in this field.
                      </p>
                      
                      <div className="flex items-center font-semibold text-blue-600">
                        Browse Courses <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* --- CALL TO ACTION --- */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Confused about which course to pick?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book a free session with our education counselors and get a personalized roadmap for your studies in Australia.
          </p>
          <a href="https://calendly.com/studyandvisa-au" target="_blank" rel="noopener noreferrer">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Book Free Consultation
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default CoursesPage;
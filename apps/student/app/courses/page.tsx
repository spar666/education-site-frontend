'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, GraduationCap, Clock, DollarSign, TrendingUp, BookOpen, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { fetchStudyLevels } from 'apps/student/app/api/studyLevel';
import { fetchCourseCategories, fetchCategoriesWithCourses, fetchPublicCourses } from 'apps/student/app/api/courses';
import { search } from 'apps/student/app/api/search';

interface Course {
  id: string;
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

interface CourseCategory {
  id: string;
  courseCategory: string;
  slug: string;
  courses?: Course[];
  courseCount?: number;
}

function CoursesPage() {
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching courses data...');
        
        const [levels, categories, courses] = await Promise.all([
          fetchStudyLevels(),
          fetchCourseCategories(),
          fetchPublicCourses()
        ]);
        
        console.log('Study levels:', levels);
        console.log('Course categories:', categories);
        console.log('All courses:', courses);
        
        setStudyLevels(levels || []);
        setCourseCategories(categories || []);
        setAllCourses(courses || []);
      } catch (error) {
        console.error('Error fetching courses data:', error);
        // Set fallback data
        setStudyLevels([]);
        setCourseCategories([]);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search courses with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const performSearch = async (term: string) => {
    setIsSearching(true);
    console.log('Searching courses for:', term);

    try {
      const results = await search({
        courseCategory: term,
        limit: 20,
      });

      console.log('Search results:', results);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Get course count for each category
  const getCategoryCourseCount = (categoryName: string) => {
    return allCourses.filter(course => 
      course.courseCategory?.courseCategory === categoryName
    ).length;
  };

  // Filter courses based on search and filters
  const getFilteredCourses = () => {
    let filtered = allCourses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCategory?.courseCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course =>
        course.courseCategory?.courseCategory === selectedCategory
      );
    }

    return filtered;
  };

  const filteredCourses = getFilteredCourses();

  // Study level options from API
  const studyLevelOptions = studyLevels.map(level => ({
    value: level.slug,
    label: level.name,
    courseCount: level.course?.length || 0
  }));

  // Add "All Levels" option
  studyLevelOptions.unshift({ value: 'all', label: 'All Levels', courseCount: allCourses.length });

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect <span className="text-blue-600">Course</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8">
              Explore 500+ courses across Australian universities and find the program that matches your career goals
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses (e.g., MBA, Computer Science, Nursing...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Study Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Study Level
                      </label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      >
                        <option value="all">All Levels</option>
                        {studyLevelOptions.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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

                  {/* Clear Filters */}
                  {(selectedLevel !== 'all' || selectedCategory !== 'all' || searchTerm) && (
                    <button
                      onClick={() => {
                        setSelectedLevel('all');
                        setSelectedCategory('all');
                        setSearchTerm('');
                      }}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { value: `${allCourses.length}+`, label: 'Courses' },
              { value: '50+', label: 'Universities' },
              { value: `${courseCategories.length}+`, label: 'Study Fields' },
              { value: '98%', label: 'Success Rate' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {searchTerm && (
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSearching ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching courses...
                  </span>
                ) : searchResults.length > 0 ? (
                  <>
                    Found <span className="text-blue-600">{searchResults.length}</span> universities
                  </>
                ) : (
                  <>
                    No universities found for "<span className="text-blue-600">{searchTerm}</span>"
                  </>
                )}
              </h2>
              <p className="text-gray-600">
                {isSearching ? 'Please wait while we search...' : 
                 searchResults.length > 0 ? `Showing universities offering courses related to "${searchTerm}"` :
                 'Try different search terms or browse all courses below.'}
              </p>
            </div>
            
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {searchResults.slice(0, 6).map((university: any) => (
                  <Link key={university._id || university.id} href={`/university/details?uni=${university.slug}`}>
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {university.universityName}
                      </h3>
                      {university.destination?.name && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <GraduationCap className="w-4 h-4 mr-1 text-blue-500" />
                          {university.destination.name}
                        </div>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4"
                         dangerouslySetInnerHTML={{ __html: university.description || 'No description available' }}
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" />
                          View Courses
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {searchResults.length > 6 && (
              <div className="text-center">
                <Link href={`/search?courseCategory=${searchTerm}`}>
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
                    View All Results ({searchResults.length} universities)
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Filtered Courses Section */}
      {(selectedCategory !== 'all' || selectedLevel !== 'all') && !searchTerm && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Filtered Courses
              </h2>
              <p className="text-gray-600">
                {filteredCourses.length} courses found
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                {selectedLevel !== 'all' && ` at ${studyLevels.find(l => l.slug === selectedLevel)?.name || selectedLevel} level`}
              </p>
            </div>
            
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.slice(0, 9).map((course) => (
                  <Link key={course.id} href={`/course/details/${course.slug}`}>
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {course.courseName}
                      </h3>
                      {course.courseCategory && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                          {course.courseCategory.courseCategory}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          View Details
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or browse all course categories below.
                </p>
                <button
                  onClick={() => {
                    setSelectedLevel('all');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
            
            {filteredCourses.length > 9 && (
              <div className="text-center mt-8">
                <Link href={`/search?courseCategory=${selectedCategory}&level=${selectedLevel}`}>
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
                    View All Filtered Results ({filteredCourses.length} courses)
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Course Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Course Categories
            </h2>
            <p className="text-lg text-gray-600">
              Explore courses by field of study
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : courseCategories.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No course categories found</h3>
              <p className="text-gray-500">Course categories will appear here once they are added to the system.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courseCategories.map((category, index) => {
                const courseCount = getCategoryCourseCount(category.courseCategory);
                const categoryCourses = allCourses.filter(course => 
                  course.courseCategory?.courseCategory === category.courseCategory
                );
                
                // Get popular courses from this category
                const popularCourses = categoryCourses.slice(0, 3).map(course => course.courseName);
                
                // Define colors for different categories
                const colors = ['blue', 'purple', 'orange', 'green', 'pink', 'cyan'];
                const color = colors[index % colors.length];
                
                return (
                  <div
                    key={category.id || index}
                    className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-xl bg-${color}-50 text-${color}-600 mb-6`}>
                      <BookOpen className="w-8 h-8" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {category.courseCategory}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                      Explore courses in {category.courseCategory} field
                    </p>

                    {/* Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>{courseCount} courses available</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>Various durations</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-orange-600" />
                        <span>Competitive fees</span>
                      </div>
                    </div>

                    {/* Popular Courses */}
                    {popularCourses.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-500 mb-3">POPULAR COURSES:</p>
                        <div className="space-y-2">
                          {popularCourses.map((course, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              <span className="text-sm text-gray-700">{course}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Link href={`/search?courseCategory=${category.courseCategory}`}>
                      <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
                        Explore Courses
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Study Levels Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Study Level
            </h2>
            <p className="text-lg text-gray-600">
              Find programs that match your academic background
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyLevelOptions.map((level, index) => (
              <Link key={index} href={`/search?level=${level.value}`}>
                <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{level.label}</h3>
                  <p className="text-sm text-gray-600 mb-2">{level.courseCount} courses</p>
                  <p className="text-xs text-blue-600 font-medium">View programs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Need Help Choosing the Right Course?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our expert advisors will help you find the perfect course based on your goals and background
          </p>
          <a href="https://calendly.com/studyandvisa-au" target="_blank" rel="noopener noreferrer">
            <button className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl">
              Book Free Course Counseling
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default CoursesPage;


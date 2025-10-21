'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Users, TrendingUp, DollarSign, GraduationCap, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { fetchAllUniversityByDestination, fetchAllPopularDestination } from 'apps/student/app/api/studyDestination';
import { search as searchAPI } from 'apps/student/app/api/search';

interface Destination {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  universityCount?: number;
}

interface DestinationWithDetails extends Destination {
  universities?: number;
  students?: number;
  avgCost?: string;
  state?: string;
  highlights?: string[];
  topUniversities?: string[];
}

function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sample destination data with details
  const destinationDetails = [
    {
      name: 'Sydney',
      state: 'New South Wales',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
      universities: 12,
      students: 50000,
      avgCost: '$20,000 - $45,000',
      topUniversities: ['University of Sydney', 'UNSW', 'UTS'],
      highlights: ['Harbor City', 'Job Opportunities', 'Multicultural'],
    },
    {
      name: 'Melbourne',
      state: 'Victoria',
      image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800',
      universities: 10,
      students: 45000,
      avgCost: '$18,000 - $42,000',
      topUniversities: ['University of Melbourne', 'Monash University', 'RMIT'],
      highlights: ['Cultural Capital', 'Student Friendly', 'Arts & Design'],
    },
    {
      name: 'Brisbane',
      state: 'Queensland',
      image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
      universities: 8,
      students: 35000,
      avgCost: '$16,000 - $38,000',
      topUniversities: ['University of Queensland', 'QUT', 'Griffith University'],
      highlights: ['Sunshine State', 'Affordable Living', 'Great Weather'],
    },
    {
      name: 'Perth',
      state: 'Western Australia',
      image: 'https://images.unsplash.com/photo-1536739074780-6e0d2143c7af?w=800',
      universities: 5,
      students: 25000,
      avgCost: '$15,000 - $36,000',
      topUniversities: ['University of Western Australia', 'Curtin University', 'Murdoch University'],
      highlights: ['Mining Hub', 'Beach Lifestyle', 'Regional Opportunities'],
    },
    {
      name: 'Adelaide',
      state: 'South Australia',
      image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800',
      universities: 6,
      students: 28000,
      avgCost: '$14,000 - $34,000',
      topUniversities: ['University of Adelaide', 'University of South Australia', 'Flinders University'],
      highlights: ['Regional Points', 'Wine Region', 'Affordable'],
    },
    {
      name: 'Canberra',
      state: 'Australian Capital Territory',
      image: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?w=800',
      universities: 3,
      students: 18000,
      avgCost: '$17,000 - $40,000',
      topUniversities: ['Australian National University', 'University of Canberra'],
      highlights: ['Capital City', 'Government Jobs', 'Safe & Clean'],
    },
  ];

  // Fetch initial destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        console.log('Fetching destinations from API...');
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
        
        const [allDests, popularDests] = await Promise.all([
          fetchAllUniversityByDestination(),
          fetchAllPopularDestination()
        ]);
        
        console.log('All destinations response:', allDests);
        console.log('Popular destinations response:', popularDests);
        
        setDestinations(allDests || []);
        setPopularDestinations(popularDests || []);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        // If API fails, we'll use sample data
        setPopularDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Search universities by location with debouncing
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    console.log('=== Searching universities by location ===');
    console.log('Search term:', term);

    try {
      const results = await searchAPI({
        location: term,
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
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  // Filter destinations based on search term
  const getFilteredDestinations = () => {
    const dataToFilter = popularDestinations.length > 0 ? popularDestinations : destinationDetails;
    
    if (!searchTerm.trim()) {
      return dataToFilter;
    }
    
    return dataToFilter.filter((dest: any) => {
      const searchLower = searchTerm.toLowerCase();
      const details = destinationDetails.find(d => d.name === dest.name) || destinationDetails[0];
      
      return (
        dest.name?.toLowerCase().includes(searchLower) ||
        details.state?.toLowerCase().includes(searchLower) ||
        details.highlights?.some((h: string) => h.toLowerCase().includes(searchLower)) ||
        details.topUniversities?.some((u: string) => u.toLowerCase().includes(searchLower))
      );
    });
  };

  const filteredDestinations = getFilteredDestinations();

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
              Study Destinations in <span className="text-blue-600">Australia</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8">
              Explore top Australian cities and find the perfect place to pursue your education dreams
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by city, state, highlights, or universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-3 text-sm text-center">
                  {isSearching ? (
                    <p className="text-blue-600 flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching universities...
                    </p>
                  ) : searchResults.length > 0 ? (
                    <p className="text-green-600">
                      ✓ Found {searchResults.length} {searchResults.length === 1 ? 'university' : 'universities'}
                    </p>
                  ) : searchTerm.length >= 2 ? (
                    <p className="text-gray-600">
                      No universities found. Try different search terms.
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Type at least 2 characters to search
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Universities Found Section - Show when searching */}
      {searchTerm && searchResults.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Found <span className="text-blue-600">{searchResults.length}</span> {searchResults.length === 1 ? 'University' : 'Universities'}
              </h2>
              <p className="text-gray-600">
                Showing universities matching "{searchTerm}"
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((university: any) => (
                <Link key={university._id || university.id} href={`/university/details?uni=${university.slug}`}>
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {university.universityName}
                    </h3>
                    {university.destination?.name && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                        {university.destination.name}
                      </div>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4"
                       dangerouslySetInnerHTML={{ __html: university.description || 'No description available' }}
                    />
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
            
            <div className="text-center mt-8">
              <Link href={`/search?location=${searchTerm}`}>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
                  View All Results in Search Page
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Destinations Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          {!loading && !searchTerm && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Popular Study Destinations
              </h2>
            </div>
          )}
          
          {!loading && searchTerm && searchResults.length === 0 && !isSearching && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Study Destinations
              </h2>
              <p className="text-gray-600 mt-2">
                No universities found for "{searchTerm}". Showing all destinations below.
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-2xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No destinations found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search term or browse all destinations
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination: any, index) => {
                // Merge API data with sample details
                const details = destinationDetails.find(d => d.name === destination.name) || destinationDetails[index % destinationDetails.length];
                const displayData = {
                  ...details,
                  name: destination.name || details.name,
                  image: destination.image || details.image,
                  universities: destination.universityCount || details.universities,
                  slug: destination.slug || destination.name.toLowerCase(),
                };

                return (
                  <div
                    key={destination.id || index}
                    className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={displayData.image}
                        alt={displayData.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-900">
                        {displayData.universities}+ Universities
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {displayData.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{displayData.state}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Students</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {displayData.students?.toLocaleString()}+
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-500">Avg. Cost/Year</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {displayData.avgCost}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {displayData.highlights?.map((highlight, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Top Universities */}
                      <div className="mb-6">
                        <p className="text-xs text-gray-500 mb-2">Top Universities:</p>
                        <div className="space-y-1">
                          {displayData.topUniversities?.slice(0, 2).map((uni, idx) => (
                            <p key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                              <GraduationCap className="w-3 h-3 text-blue-600" />
                              {uni}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link href={`/search?location=${displayData.slug}`}>
                        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
                          Explore {displayData.name}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Study in Australia Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Study in Australia?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Australia offers world-class education, diverse culture, and excellent post-study opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: 'World-Class Education',
                description: '7 universities in global top 100',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Multicultural',
                description: 'Students from 190+ countries',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Work Opportunities',
                description: 'Post-study work rights up to 4 years',
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Quality of Life',
                description: 'Safe, vibrant cities with great lifestyle',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="inline-flex p-4 rounded-xl bg-blue-50 text-blue-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Australian Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a free consultation to discuss your study destination preferences
          </p>
          <a href="https://calendly.com/studyandvisa-au" target="_blank" rel="noopener noreferrer">
            <button className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl">
              Book Free Consultation
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default DestinationsPage;


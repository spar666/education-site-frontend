'use client';
import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface IStudent {
  id: number;
  name: string;
  photo: string;
  country: string;
  countryFlag: string;
  course: string;
  university: string;
  outcome: string;
  testimonial: string;
  rating: number;
}

function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const students: IStudent[] = [
    {
      id: 1,
      name: 'Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      country: 'Nepal',
      countryFlag: '🇳🇵',
      course: 'Master of Business Administration',
      university: 'University of Melbourne',
      outcome: 'Now working as Business Analyst at Deloitte Australia',
      testimonial: 'AussiePathways made my dream come true! From choosing the right university to securing my work visa, they were with me every step. I couldn\'t have done it without their expert guidance.',
      rating: 5
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      country: 'India',
      countryFlag: '🇮🇳',
      course: 'Bachelor of Engineering (Civil)',
      university: 'RMIT University',
      outcome: 'Secured PR and working as Civil Engineer in Sydney',
      testimonial: 'The visa process seemed overwhelming, but the team simplified everything. Their document checklist and GTE support were invaluable. Highly recommend to anyone considering Australia!',
      rating: 5
    },
    {
      id: 3,
      name: 'Ayesha Patel',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      country: 'Bangladesh',
      countryFlag: '🇧🇩',
      course: 'Master of Information Technology',
      university: 'Monash University',
      outcome: 'Software Developer at Google Australia',
      testimonial: 'Not only did they help me get into my dream course, but they also guided me through job applications and networking. I landed my dream job at Google thanks to their career support!',
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % students.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + students.length) % students.length);
  };

  return (
    <section className="py-20 lg:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Real Students, <span className="text-blue-600">Real Success</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            See how we've helped students from South Asia achieve their Australian dreams.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {students.map((student, index) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <svg className="w-12 h-12 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <span>{student.countryFlag}</span>
                    <span>{student.country}</span>
                  </p>
                </div>
              </div>

              {/* Course Info */}
              <div className="mb-4">
                <p className="text-base font-semibold text-blue-600 mb-1">{student.course}</p>
                <p className="text-sm text-gray-600">{student.university}</p>
              </div>

              {/* Outcome Badge */}
              <div className="mb-6 p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <span>✨</span>
                  <span>{student.outcome}</span>
                </p>
              </div>

              {/* Testimonial */}
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                "{student.testimonial}"
              </p>

              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(student.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SuccessStories;

'use client';
import React from 'react';
import Link from 'next/link';

function HowItWorks() {
  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Online Course Counselling',
      description: ' We help you find the right course and institution based on your goals, background, and budget.',
      badge: 'Free 30-min consultation',
      badgeColor: 'bg-green-50 text-green-600',
    },
    {
      id: 2,
      number: '02',
      title: 'Offer Letters & COEs',
      description: ' We assist with applications, required documents, and securing your Confirmation of Enrolment.',
      badge: '95% success rate',
      badgeColor: 'bg-green-50 text-green-600',
    },
    {
      id: 3,
      number: '03',
      title: 'Visa Support',
      description: ' We guide you on preparing your student visa application and arrange expert assistance from MARA-registered migration agents.',
      badge: 'Ongoing support',
      badgeColor: 'bg-green-50 text-green-600',
    },
  ];

  return (
    <section className="py-20 lg:py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Your Journey to Australia <span className="text-blue-600">Simplified</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            Three simple steps to transform your future. We've refined this process with 1,000+ successful students.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Progress Line - Desktop */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-green-400" style={{ width: '100%', marginLeft: '0', marginRight: '0' }} />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step Number Circle */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl relative z-10">
                      {step.number}
                    </div>
                    {/* Checkmark */}
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center z-20">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Arrow - Desktop Only */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-6 lg:-right-8 text-cyan-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 ${step.badgeColor} rounded-lg font-medium text-sm`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {step.badge}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <a href="https://calendly.com/studyandvisa-au" target="_blank" rel="noopener noreferrer">
              <button className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-lg">
                <span className="text-blue-600">Ready to start?</span>
                <span className="text-orange-500">Book your free consultation now</span>
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

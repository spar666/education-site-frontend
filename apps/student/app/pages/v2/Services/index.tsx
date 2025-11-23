'use client';
import { GraduationCap, FileText, Briefcase, ArrowRight } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

function Index() {
  const services = [
    {
      id: 1,
      title: 'Free Consultation',
      icon: <GraduationCap className="h-12 w-12" />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      titleColor: 'text-gray-900',
      description: 'Tell us your study goals, background, and plans. We help you understand the best pathways available.',
      features: [
        'Personalized course recommendations',
        'University application support',
        'Scholarship guidance',
        'Admission guarantee programs',
      ],
    },
    {
      id: 2,
      title: 'Course & University Selection',
      icon: <FileText className="h-12 w-12" />,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      titleColor: 'text-blue-600',
      description: 'We match you with suitable colleges and universities in Australia and help you secure offers faster.',
      features: [
        'Visa eligibility assessment',
        'Document preparation & review',
        'GTE statement assistance',
        'Health & biometrics guidance',
      ],
    },
    {
      id: 3,
      title: 'Visa Application Support',
      icon: <Briefcase className="h-12 w-12" />,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      titleColor: 'text-gray-900',
      description: 'We assist you through the student visa process and arrange help from a MARA-registered migration agent when needed.',
      features: [
        'Work visa applications',
        'Job search assistance',
        'Permanent residency pathways',
        'Skills assessment support',
      ],
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Services for Your{' '}
            <span className="text-blue-600">Australian Journey</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            From choosing the right course to settling in Australia, we're with you every step of the way.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl ${service.iconBg} ${service.iconColor} mb-6`}>
                {service.icon}
              </div>

              {/* Title */}
              <h3 className={`text-2xl font-bold ${service.titleColor} mb-4`}>
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <ArrowRight className="w-5 h-5 flex-shrink-0 text-green-500 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className="w-full py-3 px-6 bg-white text-gray-700 rounded-xl font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Index;

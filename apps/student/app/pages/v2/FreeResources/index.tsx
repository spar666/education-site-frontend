'use client';
import React, { useState } from 'react';
import { FileText, BookOpen, Bell } from 'lucide-react';

function FreeResources() {
  const resources = [
    {
      id: 1,
      title: 'Student Visa Checklist',
      description: 'Complete document checklist for Australian student visa (subclass 500)',
      icon: <FileText className="w-12 h-12" />,
      tag: 'PDF Guide',
      tagColor: 'bg-orange-100 text-orange-600',
    },
    {
      id: 2,
      title: 'University Comparison Guide',
      description: 'Compare top Australian universities by course, fees, and location',
      icon: <BookOpen className="w-12 h-12" />,
      tag: 'Interactive Tool',
      tagColor: 'bg-orange-100 text-orange-600',
    },
    {
      id: 3,
      title: 'Scholarship Alerts',
      description: 'Get notified about new scholarships and funding opportunities',
      icon: <Bell className="w-12 h-12" />,
      tag: 'Email Subscription',
      tagColor: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <section className="py-20 lg:py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Free Resources to <span className="text-blue-600">Fast-Track Your Journey</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            Download our expert guides and tools to prepare for your Australian education journey.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-center"
            >
              {/* Icon */}
              <div className="inline-flex p-6 rounded-2xl bg-blue-50 text-blue-600 mb-6">
                {resource.icon}
              </div>

              {/* Tag */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${resource.tagColor}`}>
                  {resource.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {resource.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {resource.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FreeResources;

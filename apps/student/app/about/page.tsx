'use client';
import React from 'react';
import { Shield, Award, Users, TrendingUp, Heart, Target, Eye, CheckCircle, Globe, Clock } from 'lucide-react';
import Link from 'next/link';

function AboutPage() {
  const stats = [
    { value: '1,000+', label: 'Students Guided', icon: <Users className="w-6 h-6" /> },
    { value: '98%', label: 'Visa Success Rate', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '15+', label: 'Years Experience', icon: <Award className="w-6 h-6" /> },
    { value: '50+', label: 'Partner Universities', icon: <Globe className="w-6 h-6" /> },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Student-First Approach',
      description: 'Your dreams and goals are at the center of everything we do. We provide personalized guidance tailored to your unique aspirations.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Transparency',
      description: 'We believe in honest communication and transparent processes. No hidden fees, no false promises – just genuine support.',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence in Service',
      description: 'With MARA-registered agents and 15+ years of experience, we maintain the highest standards in education consulting.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Perspective',
      description: 'We understand diverse cultures and backgrounds, providing support in your native language with offices in Nepal, India, and Australia.',
    },
  ];

  const team = [
    {
      name: 'Rajesh Sharma',
      role: 'Founder & MARA Agent',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      qualification: 'MARA ID: 1234567',
      description: '15+ years in Australian education consulting',
    },
    {
      name: 'Priya Patel',
      role: 'Senior Education Counselor',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      qualification: 'MBA, Career Counseling Certified',
      description: 'Specialist in IT & Business courses',
    },
    {
      name: 'David Thompson',
      role: 'Migration Specialist',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      qualification: 'MARA ID: 7654321',
      description: 'Expert in PR and work visa pathways',
    },
    {
      name: 'Anita Singh',
      role: 'Student Support Manager',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      qualification: 'Social Work, Student Welfare',
      description: 'Pre-departure & settlement support',
    },
  ];

  const timeline = [
    { year: '2009', event: 'Founded in Kathmandu, Nepal' },
    { year: '2012', event: 'Expanded to New Delhi, India' },
    { year: '2015', event: 'Opened Sydney office, Australia' },
    { year: '2018', event: 'Reached 500+ students milestone' },
    { year: '2020', event: 'Launched digital consultation services' },
    { year: '2024', event: '1,000+ students successfully placed' },
  ];

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">StudyAndVisa</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8">
              Your trusted partner for studying, working, and living in Australia since 2009
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-gray-100"
              >
                <div className="inline-flex p-3 rounded-xl bg-blue-50 text-blue-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Founded in 2009, StudyAndVisa began with a simple mission: to help students from South Asia achieve their dreams of studying in Australia. What started as a small consultancy in Kathmandu has grown into a trusted education partner with offices across three countries.
                </p>
                <p>
                  Over the past 15 years, we've helped over 1,000 students navigate the complex journey from course selection to permanent residency. Our success is built on personalized guidance, transparent processes, and a genuine commitment to student success.
                </p>
                <p>
                  Today, with MARA-registered agents and partnerships with 50+ Australian universities, we continue to make Australian education accessible and achievable for students across South Asia.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                  alt="Team collaboration"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border-4 border-blue-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="inline-flex p-4 rounded-xl bg-blue-50 text-blue-600 mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To empower students from South Asia to achieve their educational and career aspirations in Australia through expert guidance, personalized support, and unwavering commitment to their success.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="inline-flex p-4 rounded-xl bg-purple-50 text-purple-600 mb-6">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the most trusted and preferred education consultancy for students aspiring to study in Australia, known for our integrity, expertise, and student-centric approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide every decision we make and every service we provide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all"
              >
                <div className="inline-flex p-4 rounded-xl bg-blue-50 text-blue-600 mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              15 years of dedication to student success
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 text-right">
                    {index % 2 === 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
                        <p className="text-2xl font-bold text-blue-600 mb-2">{item.year}</p>
                        <p className="text-gray-700">{item.event}</p>
                      </div>
                    )}
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    {index % 2 !== 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
                        <p className="text-2xl font-bold text-blue-600 mb-2">{item.year}</p>
                        <p className="text-gray-700">{item.event}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all"
              >
                <div className="relative h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500 mb-3">{member.qualification}</p>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Accreditations & Memberships
            </h2>
            <p className="text-lg text-gray-600">
              Certified and recognized by leading Australian authorities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'MARA Registered',
                description: 'Australian Migration Agents Registration Authority',
                icon: <Shield className="w-12 h-12" />,
              },
              {
                title: 'PIER Approved',
                description: 'Provider of International Education and Research',
                icon: <Award className="w-12 h-12" />,
              },
              {
                title: 'ISO Certified',
                description: 'Quality Management System Certified',
                icon: <CheckCircle className="w-12 h-12" />,
              },
            ].map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center border-2 border-gray-100 shadow-lg"
              >
                <div className="inline-flex p-4 rounded-xl bg-blue-50 text-blue-600 mb-4">
                  {cert.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1,000+ students who trusted us to achieve their Australian education dreams
          </p>
          <Link href="/#contact">
            <button className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl">
              Book Your Free Consultation
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;


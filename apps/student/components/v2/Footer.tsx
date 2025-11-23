'use client';
import { Facebook, Instagram, Linkedin, Youtube, Shield, Award, Users } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../assets/Logo/Logostudyvisa.png';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Badges Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-medium">Expert Consultant</span>
            </div>
            {/* <div className="flex items-center justify-center gap-3">
              <Award className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-medium">10+ Years Experience</span>
            </div> */}
            <div className="flex items-center justify-center gap-3">
              <Users className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-medium">1,000+ Students Served</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <span className="text-xl font-bold">StudyAndVisa</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted partner for studying, working, and living in Australia. Expert guidance from course selection to permanent residency.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: '#' },
                { icon: <Instagram className="w-5 h-5" />, href: '#' },
                { icon: <Linkedin className="w-5 h-5" />, href: '#' },
                { icon: <Youtube className="w-5 h-5" />, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Services', href: '/services' },
                { name: 'How it Works', href: '#how-it-works' },
                { name: 'Success Stories', href: '#success-stories' },
                { name: 'Blog', href: '/blog' },
                { name: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-base font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {[
                'Free Consultation',
                'Course & University Selection',
                'Visa Application Support',
                
              ].map((service) => (
                <li key={service}>
                  <a
                    href="/services"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h3 className="text-base font-semibold mb-6">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-6">
              Get the latest visa updates, scholarship alerts, and study tips.
            </p>
            
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-sm text-green-400">✓ Subscribed successfully!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">
              © {currentYear} StudyAndVisa. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

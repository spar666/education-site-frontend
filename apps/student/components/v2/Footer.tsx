import { Facebook, GraduationCap, Instagram, Mail } from 'lucide-react';
import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <GraduationCap className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">StudyAndVisa</span>
            </div>
            <p className="text-blue-100">
              Expert guidance for students aspiring to pursue higher education
              abroad.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Useful Links</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-blue-100 hover:text-white">
                  Find Course
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white">
                  Study Destination
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Contact Information</h3>
            <p className="text-blue-100 mb-4">
              Be the first one to know about opportunities, offers, and events
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">
              Subscribe to our newsletter
            </h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-lg w-full text-gray-900"
              />
              <button className="bg-yellow-500 text-blue-900 px-6 py-2 rounded-r-lg font-medium">
                Subscribe
              </button>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-blue-100 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-100">
          <p> &copy; {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

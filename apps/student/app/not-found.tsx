'use client';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | 404',
  description:
    "The page you're looking for doesn't exist or may have been moved",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center">
        {/* LinkedIn-style Illustration */}
        <div className="relative mx-auto w-48 h-48">
          {/* Person */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            {/* Head */}
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-400 rounded-full"></div>
            {/* Body */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-blue-500 rounded-t-md"></div>
            {/* Arms */}
            <div className="absolute top-20 -left-4 w-4 h-12 bg-gray-400 dark:bg-gray-500 rounded-full transform -rotate-45 origin-bottom"></div>
            <div className="absolute top-20 right-0 w-4 h-12 bg-gray-400 dark:bg-gray-500 rounded-full transform rotate-45 origin-bottom"></div>
          </div>

          {/* Magnifying glass */}
          <div className="absolute top-8 right-4 w-20 h-20 border-4 border-gray-300 dark:border-gray-500 rounded-full animate-pulse">
            <div className="absolute bottom-0 right-0 w-6 h-4 bg-gray-300 dark:bg-gray-500 transform rotate-45 origin-top-left"></div>
          </div>

          {/* Floating documents */}
          <div className="absolute top-4 left-4 w-8 h-10 bg-white dark:bg-gray-700 shadow-md rounded-sm transform -rotate-6 animate-float"></div>
          <div className="absolute top-2 left-12 w-6 h-8 bg-white dark:bg-gray-700 shadow-md rounded-sm transform rotate-3 animate-float delay-200"></div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Page not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            We couldn't find the page you're looking for. It might have been
            moved or doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center pt-4">
          <Link
            href="/"
            replace={true}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center justify-center"
          >
            Back to Home
          </Link>
          {/* <Link
            href="/contact"
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300 flex items-center justify-center"
          >
            Contact support
          </Link> */}
        </div>

        {/* Additional Help */}
        <div className="pt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Try searching or{' '}
            <Link
              href="/help"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              visit our help center
            </Link>
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

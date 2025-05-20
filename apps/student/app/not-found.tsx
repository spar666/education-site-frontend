'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Page not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          We couldn't find the page you're looking for. It might have been moved
          or doesn't exist.
        </p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center pt-4">
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200"
          >
            Back to Home
          </button>
          <Link
            href="/help"
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-full transition-colors duration-200"
          >
            Visit Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}

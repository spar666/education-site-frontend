import React from 'react';

function Details() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Education in Canada
          </h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            Canada is one of the most popular destinations for international
            students, offering world-class education at affordable tuition
            rates. With its multicultural environment, excellent quality of
            life, and post-study work opportunities, Canada provides an ideal
            setting for academic and personal growth. Canadian degrees are
            recognized globally, and the country's education system emphasizes
            research and practical learning.
          </p>

          <h3 className="text-xl font-semibold text-blue-900 mb-4">
            Top Universities in Canada
          </h3>
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ranking
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      University of Toronto
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Toronto, ON</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #1 in Canada
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      University of British Columbia
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Vancouver, BC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #2 in Canada
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      McGill University
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Montreal, QC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #3 in Canada
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Student Testimonials
            </h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-2">
                "Studying in Canada was the best decision I ever made. The
                education system is excellent and the people are very
                welcoming."
              </p>
              <p className="font-medium">- Maria S., International Student</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-2">
                "The research opportunities at Canadian universities are
                outstanding. I gained valuable experience that helped me land my
                dream job."
              </p>
              <p className="font-medium">- James L., Graduate Student</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Canada at a Glance
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">International Students</p>
                <p className="text-xl font-bold">642,000+</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Tuition</p>
                <p className="text-xl font-bold">$25,000 CAD/year</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Work During Study</p>
                <p className="text-xl font-bold">20 hrs/week</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Post-Graduation Work</p>
                <p className="text-xl font-bold">Up to 3 years</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Available Programs
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Computer Science</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Business Administration</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Engineering</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Health Sciences</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Requirements
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>High School Diploma</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>English Proficiency (IELTS 6.5+)</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Letter of Recommendation</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Statement of Purpose</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 bg-blue-800 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Need Assistance?</h3>
            <p className="mb-4">
              Our education consultants can help you find the perfect program in
              Canada.
            </p>
            <button className="w-full bg-white text-blue-800 hover:bg-blue-50 py-2 rounded-md font-medium transition-colors">
              Get Free Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;

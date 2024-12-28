import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import { Lightbulb, PhoneCall, UsersRound } from 'lucide-react';
import React from 'react';

const Services = () => {
  return (
    <section className="my-10">
      <MaxWidthWrapper className="pb-10 lg:pb-16">
        <div className="text-center mb-10"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-6 rounded-lg border-2 border-shadow  shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="text-orange-500 text-4xl">
                <Lightbulb className="h-10 w-10" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-dark-blue mb-2">
              One Stop Study Solution
            </h3>
            <p className="text-gray-600 mb-4">
              Get a full view so you know where to save. Track spending, data,
              and keep tabs on your subscription.
            </p>
            <button className="mt-8 px-6 py-2 bg-dark-blue text-white rounded-lg shadow hover:bg-blue-700">
              Learn More
            </button>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-6 rounded-lg border-2 border-shadow  shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="text-purple-500 text-4xl">
                <UsersRound className="h-10 w-10" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-dark-blue mb-2">
              One To One Discussion
            </h3>
            <p className="text-gray-600 mb-4">
              Get a full view so you know where to save. Track spending, data,
              and keep tabs on your subscription.
            </p>
            <button className="mt-8 px-6 py-2 bg-dark-blue text-white rounded-lg shadow hover:bg-blue-700">
              Learn More
            </button>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-6 rounded-lg border-2 border-shadow  shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="text-red-500 text-4xl">
                <PhoneCall className="h-10 w-10" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-dark-blue mb-2">
              End To End Support
            </h3>
            <p className="text-gray-600 mb-4">
              Get a full view so you know where to save. Track spending, data,
              and keep tabs on your subscription.
            </p>
            <button className="mt-8 px-6 py-2 bg-dark-blue text-white rounded-lg shadow hover:bg-blue-700">
              Learn More
            </button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default Services;

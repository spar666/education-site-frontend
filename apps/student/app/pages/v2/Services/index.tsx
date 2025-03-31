import { Globe, Phone, Users } from 'lucide-react';
import React from 'react';

// Skeleton Loader Component
const ServiceSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

function Index() {
  // Adding loading state - you might want to connect this to actual data fetching
  const [loading] = React.useState<boolean>(false); // Set to true if you have async data loading

  const services = [
    {
      id: 1,
      title: 'One Stop Study Solution',
      icon: <Globe className="h-8 w-8 text-blue-900" />,
      description:
        'Get a full view so you know where to save. Track spending, data, and keep tabs on your subscription.',
    },
    {
      id: 2,
      title: 'One To One Discussion',
      icon: <Users className="h-8 w-8 text-blue-900" />,
      description:
        'Personal consultation sessions to guide you through every step of your educational journey.',
    },
    {
      id: 3,
      title: 'End To End Support',
      icon: <Phone className="h-8 w-8 text-blue-900" />,
      description:
        'Complete assistance from application to admission, visa processing to pre-departure guidance.',
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Services</h2>
        <p className="text-gray-600 mb-12">
          Comprehensive support for your educational journey abroad
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? Array(3)
                .fill(null)
                .map((_, index) => <ServiceSkeleton key={index} />)
            : services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="mb-6">{service.icon}</div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default Index;

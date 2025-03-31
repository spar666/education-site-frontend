import React from 'react';

// Skeleton Loader Component
const AboutSkeleton: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-pulse">
          <div>
            <div className="h-10 w-32 bg-gray-200 rounded mb-6" />{' '}
            {/* Matches h2 height */}
            <div className="h-7 w-2/3 bg-gray-200 rounded mb-4" />{' '}
            {/* Matches h3 height */}
            <div className="space-y-4 mb-6">
              {' '}
              {/* Adjusted line spacing */}
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-11/12 bg-gray-200 rounded" />
              <div className="h-4 w-10/12 bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />{' '}
              {/* Added extra line */}
            </div>
            <div className="h-11 w-44 bg-gray-200 rounded-lg" />{' '}
            {/* Matches button height */}
          </div>
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-200 rounded-xl" />
            <div className="aspect-[16/10] bg-gray-200 rounded-xl relative z-10" />{' '}
            {/* Better aspect ratio */}
          </div>
        </div>
      </div>
    </section>
  );
};

function Index() {
  const [loading] = React.useState<boolean>(false); // Change to true if you add data fetching

  if (loading) {
    return <AboutSkeleton />;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6 leading-tight">
              About Us
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 leading-tight">
              Moving beyond product innovation to gain a competitive advantage
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              StudyAndVisa is a leading consultancy specializing in educational
              and immigration services. Our team of dedicated professionals
              brings passion, expertise, and a collaborative spirit to every
              project. Whether you're seeking specific services or exploring new
              opportunities, we're here to guide you every step of the way.
            </p>
            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">
              Learn More About Us
            </button>
          </div>
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-200 rounded-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Team meeting"
              className="rounded-xl relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Index;

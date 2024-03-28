import CustomSearch from 'apps/student/components/CustomSearch.tsx';
import MaxWidthWrapper from 'apps/student/components/MaxWidthWrapper';
import {
  Button,
  buttonVariants,
} from 'libs/ui-components/src/components/ui/button';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Your marketplace for high-quality{' '}
          <span className="text-blue-600">study course</span>.
        </h1>
        <p className="mt-6 text-lg max-w-prose text-muted-foreground">
          Start your journey to discover new horizons, expand your knowledge,
          and create a world of possibilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <CustomSearch />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

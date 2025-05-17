import { Search } from 'lucide-react';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { useEffect, useState } from 'react';
import { fetchStudyLevels } from 'apps/student/app/api/studyLevel';
import {
  fetchCourseCategories,
  fetchCourses,
} from 'apps/student/app/api/courses';
import { fetchAllUniversityByDestination } from 'apps/student/app/api/studyDestination';
import { useRouter } from 'next/navigation';

interface Level {
  id: string;
  name: string;
  slug: string;
}

interface Course {
  id: string;
  courseName: string;
  slug: string;
}

interface Location {
  id: string;
  name: string;
  slug: string;
}

const CustomSearch = () => {
  const router = useRouter();
  const [levels, setLevels] = useState<Level[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetchStudyLevels()
      .then((data) => setLevels(data))
      .catch((error) => console.error('Error fetching levels:', error));

    fetchCourseCategories()
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));

    fetchAllUniversityByDestination()
      .then((data) => setLocations(data))
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  const handleSearch = () => {
    try {
      // Helper function to safely get select values
      const getSelectValue = (name: string): string | null => {
        const select = document.querySelector<HTMLSelectElement>(
          `select[name="${name}"]`
        );
        return select?.value.trim() || null;
      };

      // Get selected values with null checks
      const levelId = getSelectValue('level');
      const courseId = getSelectValue('course');
      const locationId = getSelectValue('location');

      // Find corresponding slugs with proper error handling
      const findSlug = <T extends { id: string; slug: string }>(
        items: T[],
        id: string | null
      ): string | null => {
        if (!id) return null;
        const item = items.find((item) => item.id === id);
        return item?.slug || null;
      };

      const levelSlug = findSlug(levels, levelId);
      const courseSlug = findSlug(courses, courseId);
      const locationSlug = findSlug(locations, locationId);

      // Build URL path segments with correct parameter mapping
      const pathSegments = ['search'];

      // Correct parameter mapping:
      if (locationSlug) pathSegments.push(`destination=${locationSlug}`);
      if (levelSlug) pathSegments.push(`qualification=${levelSlug}`);
      if (courseSlug) pathSegments.push(`course=${courseSlug}`);

      // Only navigate if we have at least one parameter
      if (pathSegments.length > 1) {
        const searchPath = `/${pathSegments.join('/')}`;
        router.push(searchPath);
      } else {
        router.push('/search');
      }
    } catch (error) {
      console.error('Search failed:', error);
      router.push('/search'); // Fallback on error
    }
  };

  return (
    <MaxWidthWrapper>
      <div className="mt-5 border rounded-lg overflow-hidden bg-white shadow-md sm:flex sm:justify-start">
        <div className="flex flex-col md:flex-row justify-start md:justify-between sm:justify-start gap-2 md:gap-4 p-2 md:p-4 p-2 sm:w-[100%]">
          <select
            name="level"
            className="w-full md:w-auto h-10 px-2 md:px-4 bg-white rounded-lg text-black mb-2 md:mb-0"
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level?.id} value={level?.id}>
                {level?.name}
              </option>
            ))}
          </select>
          <select
            name="course"
            className="w-full md:w-auto h-10 px-2 md:px-4 bg-white rounded-lg text-black mb-2 md:mb-0"
          >
            <option value="">Select Course Category</option>
            {courses.map((course) => (
              <option key={course?.id} value={course?.id}>
                {course?.name}
              </option>
            ))}
          </select>
          <select
            name="location"
            className="w-full md:w-auto h-10 px-2 md:px-4 bg-white rounded-lg text-black mb-2 md:mb-0"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="w-full md:w-auto h-10 px-2 md:px-4 bg-dark-blue text-white flex items-center justify-center "
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CustomSearch;

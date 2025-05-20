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
      // Helper to get select value by name
      const getSelectValue = (name: string): string | null =>
        document
          .querySelector<HTMLSelectElement>(`select[name="${name}"]`)
          ?.value.trim() || null;

      // Helper to find slug by id
      const findSlug = <T extends { id: string; slug: string }>(
        items: T[],
        id: string | null
      ): string | null =>
        id ? items.find((item) => item.id === id)?.slug || null : null;

      const levelSlug = findSlug(levels, getSelectValue('level'));
      const courseSlug = findSlug(courses, getSelectValue('course'));
      const locationSlug = findSlug(locations, getSelectValue('location'));

      const searchParams = new URLSearchParams();
      if (locationSlug) searchParams.append('destination', locationSlug);
      if (levelSlug) searchParams.append('qualification', levelSlug);
      if (courseSlug) searchParams.append('course', courseSlug);

      const searchPath = `/search${
        searchParams.toString() ? '?' + searchParams.toString() : ''
      }`;
      router.push(searchPath);
    } catch (error) {
      console.error('Search failed:', error);
      router.push('/search');
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

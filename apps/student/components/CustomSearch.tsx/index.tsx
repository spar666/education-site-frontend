'use client';
import { Search } from 'lucide-react';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { useEffect, useState } from 'react';
import { fetchStudyLevels } from 'apps/student/app/api/studyLevel';
import { fetchCourses } from 'apps/student/app/api/courses';
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetchStudyLevels()
      .then((data) => setLevels(data))
      .catch((error) => console.error('Error fetching levels:', error));

    // Fetch courses from API
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));

    // // Fetch locations from API
    fetchAllUniversityByDestination()
      .then((data) => setLocations(data))
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  const handleSearch = () => {
    const level =
      document.querySelector<HTMLSelectElement>('select[name="level"]')
        ?.value || '';
    const course =
      document.querySelector<HTMLSelectElement>('select[name="course"]')
        ?.value || '';
    const location =
      document.querySelector<HTMLSelectElement>('select[name="location"]')
        ?.value || '';

    // Redirect to the search page with query parameters
    router.push(`/search?level=${level}&course=${course}&location=${location}`);
  };
  return (
    <MaxWidthWrapper>
      <div className="mt-5 border rounded-lg overflow-hidden bg-white shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0 p-4">
          <select
            name="level"
            className="w-full md:w-64 h-full px-4 py-2 bg-white rounded-lg text-black"
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level?.id} value={level?.id}>
                {level?.name}
              </option>
            ))}
          </select>
          <span className="text-black px-2 h-full">|</span>
          <select
            name="course"
            className="w-full md:w-64 h-full px-4 py-2 bg-white  text-black"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course?.id} value={course?.id}>
                {course?.courseName}
              </option>
            ))}
          </select>
          <span className="text-black px-2 h-full">|</span>
          <select
            name="location"
            className="w-full md:w-64 h-full px-4 py-2 bg-white  text-black"
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
            className="w-full ml-3 md:w-20 h-10 px-4 py-2 bg-indigo-500  flex items-center justify-center text-white hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            onClick={handleSearch}
          >
            <Search className="h-full text-white text-bold" />
          </button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CustomSearch;

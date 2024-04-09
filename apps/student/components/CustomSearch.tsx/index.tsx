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

    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));

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

    router.push(`/search?level=${level}&course=${course}&location=${location}`);
  };

  return (
    <MaxWidthWrapper>
      <div className="mt-5 border rounded-lg overflow-hidden bg-white shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-4 p-2 md:p-4">
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
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course?.id} value={course?.id}>
                {course?.courseName}
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
            className="w-full md:w-auto h-10 px-2 md:px-4 bg-dark-blue text-white flex items-center justify-center hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
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

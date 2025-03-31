'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import Navbar from 'apps/student/components/Navbar';
// import Footer from 'apps/student/components/Footer';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  BookOpen,
  CheckCircle,
  Pencil,
} from 'lucide-react';
import useUser from 'apps/student/hook/useUser';
import { updateUser } from 'apps/student/app/api/user';
import { fetchStudyLevels } from 'apps/student/app/api/studyLevel';
import { fetchCourses } from 'apps/student/app/api/courses';
import { fetchAllUniversityByDestination } from 'apps/student/app/api/studyDestination';
import Navbar from 'apps/student/components/v2/Navbar';
import Footer from 'apps/student/components/v2/Footer';

// Define interfaces
interface StudyLevel {
  id: string;
  name: string;
}

interface Destination {
  id: string;
  name: string;
}

interface Course {
  id: string;
  courseName: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  studyLevel?: string | StudyLevel; // Can be string or object
  destination?: string | Destination; // Can be string or object
  course?: string | Course; // Can be string or object
}

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  studyLevel: string;
  destination: string;
  preferredCourse: string;
}

interface ProfileField {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface EditField {
  name: keyof ProfileFormData;
  label: string;
  value: string;
  icon: React.ReactNode;
  isSelect?: boolean;
  options?: (StudyLevel | Destination | Course)[];
}

// Assuming useUser returns these types
interface UserHook {
  user: UserProfile | null;
}

const Profile: React.FC = () => {
  const { user } = useUser() as UserHook;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    email: '',
    phone: '',
    studyLevel: '',
    destination: '',
    preferredCourse: '',
  });
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const formattedName = `${user?.firstName || ''} ${
    user?.lastName || ''
  }`.trim();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studyLevelData, destinationData, courseData] = await Promise.all(
          [
            fetchStudyLevels(),
            fetchAllUniversityByDestination(),
            fetchCourses(),
          ]
        );

        setStudyLevels(studyLevelData || []);
        setDestinations(destinationData || []);
        setCourses(courseData || []);

        if (user) {
          setFormData({
            fullName: formattedName,
            email: user.email || '',
            phone: user.phone || '',
            studyLevel:
              typeof user.studyLevel === 'string'
                ? user.studyLevel
                : user.studyLevel?.name || '',
            destination:
              typeof user.destination === 'string'
                ? user.destination
                : user.destination?.name || '',
            preferredCourse:
              typeof user.course === 'string'
                ? user.course
                : user.course?.courseName || '',
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, [user, formattedName]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await updateUser(formData);
      setTimeout(() => {
        setSubmitted(false);
        setIsEditMode(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to update user data:', error);
      setSubmitted(false);
    }
  };

  const formatStudyLevel = (): string => {
    if (!user?.studyLevel) return 'Not Provided';
    return typeof user.studyLevel === 'string'
      ? user.studyLevel
      : user.studyLevel.name || 'Not Provided';
  };

  const formatDestination = (): string => {
    if (!user?.destination) return 'Not Provided';
    return typeof user.destination === 'string'
      ? user.destination
      : user.destination.name || 'Not Provided';
  };

  const formatCourse = (): string => {
    if (!user?.course) return 'Not Provided';
    return typeof user.course === 'string'
      ? user.course
      : user.course.courseName || 'Not Provided';
  };

  const ViewMode: React.FC = () => {
    const profileFields: ProfileField[] = [
      { label: 'Full Name', value: formattedName, icon: <User /> },
      {
        label: 'Email Address',
        value: user?.email || 'Not Provided',
        icon: <Mail />,
      },
      {
        label: 'Phone Number',
        value: user?.phone || 'Not Provided',
        icon: <Phone />,
      },
      {
        label: 'Current Qualification',
        value: formatStudyLevel(),
        icon: <GraduationCap />,
      },
      {
        label: 'Preferred Destination',
        value: formatDestination(),
        icon: <MapPin />,
      },
      {
        label: 'Preferred Course',
        value: formatCourse(),
        icon: <BookOpen />,
      },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileFields.map(({ label, value, icon }, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="w-5 h-5 text-[#080d4e] mr-2">{icon}</span>
                <span className="text-sm font-medium text-gray-600">
                  {label}
                </span>
              </div>
              <p className="text-lg font-medium text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsEditMode(true)}
          className="w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 bg-[#080d4e] text-white hover:bg-[#0a1166] transition-all duration-300 transform hover:scale-[1.02]"
        >
          <Pencil className="w-5 h-5" /> Edit Profile
        </button>
      </div>
    );
  };

  const EditMode: React.FC = () => {
    const editFields: EditField[] = [
      {
        name: 'fullName',
        label: 'Full Name',
        value: formData.fullName,
        icon: <User />,
      },
      {
        name: 'email',
        label: 'Email Address',
        value: formData.email,
        icon: <Mail />,
      },
      {
        name: 'phone',
        label: 'Phone Number',
        value: formData.phone,
        icon: <Phone />,
      },
      {
        name: 'studyLevel',
        label: 'Highest Qualification',
        value: formData.studyLevel,
        icon: <GraduationCap />,
        isSelect: true,
        options: studyLevels,
      },
      {
        name: 'destination',
        label: 'Preferred Destination',
        value: formData.destination,
        icon: <MapPin />,
        isSelect: true,
        options: destinations,
      },
      {
        name: 'preferredCourse',
        label: 'Preferred Course',
        value: formData.preferredCourse,
        icon: <BookOpen />,
        isSelect: true,
        options: courses,
      },
    ];

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {editFields.map(
            ({ name, label, value, icon, isSelect, options }, index) => (
              <div key={index} className="relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="w-4 h-4 mr-2">{icon}</span>
                  {label}
                </label>
                {isSelect && options ? (
                  <select
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 transition"
                  >
                    <option value="" disabled>
                      Select {label}
                    </option>
                    {options.map((option) => (
                      <option
                        key={option.id}
                        value={
                          'name' in option
                            ? option.name
                            : 'courseName' in option
                            ? option.courseName
                            : ''
                        }
                      >
                        {'name' in option
                          ? option.name
                          : 'courseName' in option
                          ? option.courseName
                          : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={name === 'email' ? 'email' : 'text'}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 transition"
                  />
                )}
              </div>
            )
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsEditMode(false)}
            className="w-full py-3 px-6 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitted}
            className="w-full py-3 px-6 rounded-lg bg-[#080d4e] text-white hover:bg-[#0a1166] transition disabled:opacity-50"
          >
            {submitted ? (
              <CheckCircle className="w-5 h-5 mx-auto" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-8">
        {isEditMode ? <EditMode /> : <ViewMode />}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

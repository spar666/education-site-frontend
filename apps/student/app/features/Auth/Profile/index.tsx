'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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

// Interfaces (unchanged)
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
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  studyLevel?: string | StudyLevel;
  destination?: string | Destination;
  course?: string | Course;
}

interface ProfileFormData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  studyLevel: string;
  destination: string;
  preferredCourse: string;
}

const Profile: React.FC = () => {
  const { user } = useUser() as { user: UserProfile | null };
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    id: '',
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
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track client-side mounting

  const formattedName = `${user?.firstName || ''} ${
    user?.lastName || ''
  }`.trim();

  // Set mounted flag only on client
  useEffect(() => {
    setIsMounted(true);
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
            id: user.id || '',
            fullName: formattedName,
            email: user.email || '',
            phone: user.phone || '',
            studyLevel:
              typeof user.studyLevel === 'string'
                ? user.studyLevel
                : user.studyLevel?.id || '',
            destination:
              typeof user.destination === 'string'
                ? user.destination
                : user.destination?.id || '',
            preferredCourse:
              typeof user.course === 'string'
                ? user.course
                : user.course?.id || '',
          });
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    loadData();
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await updateUser({
        id: formData.id,
        qualification: formData.studyLevel,
        preferredCourse: formData.preferredCourse,
        destination: formData.destination,
      });

      setTimeout(() => {
        setSubmitted(false);
        setIsEditMode(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSubmitted(false);
    }
  };

  const formatField = (
    field: string | StudyLevel | Destination | Course | undefined,
    key: 'name' | 'courseName'
  ): string => {
    if (!field) return 'Not Provided';
    if (typeof field === 'string') return field;
    if ('courseName' in field && key === 'courseName') {
      return field.courseName || 'Not Provided';
    } else if ('name' in field && key === 'name') {
      return field.name || 'Not Provided';
    }
    return 'Not Provided';
  };

  const ViewMode: React.FC = () => (
    <div className="space-y-6 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
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
            value: formatField(user?.studyLevel, 'name'),
            icon: <GraduationCap />,
          },
          {
            label: 'Preferred Destination',
            value: formatField(user?.destination, 'name'),
            icon: <MapPin />,
          },
          {
            label: 'Preferred Course',
            value: formatField(user?.course, 'courseName'),
            icon: <BookOpen />,
          },
        ].map(({ label, value, icon }, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="w-5 h-5 text-[#080d4e] mr-2">{icon}</span>
              <span className="text-sm font-medium text-gray-600">{label}</span>
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

  const EditMode: React.FC = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 text-sm font-medium mb-1">
            <User className="w-5 h-5 mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            disabled
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 text-sm font-medium mb-1">
            <Mail className="w-5 h-5 mr-2" />
            Email Address
          </label>
          <input
            type="text"
            value={formData.email}
            disabled
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 text-sm font-medium mb-1">
            <Phone className="w-5 h-5 mr-2" />
            Phone Number
          </label>
          <input
            type="text"
            value={formData.phone}
            disabled
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
          />
        </div>
        <SelectField
          label="Current Qualification"
          name="studyLevel"
          value={formData.studyLevel}
          options={studyLevels}
          onChange={handleChange}
          icon={<GraduationCap />}
        />
        <SelectField
          label="Preferred Destination"
          name="destination"
          value={formData.destination}
          options={destinations}
          onChange={handleChange}
          icon={<MapPin />}
        />
        <SelectField
          label="Preferred Course"
          name="preferredCourse"
          value={formData.preferredCourse}
          options={courses}
          onChange={handleChange}
          icon={<BookOpen />}
        />
      </div>
      <button
        type="submit"
        disabled={submitted}
        className="w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 bg-[#080d4e] text-white hover:bg-[#0a1166] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
      >
        {submitted ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Pencil className="w-5 h-5" />
        )}
        {submitted ? 'Updated!' : 'Save Changes'}
      </button>
    </form>
  );

  const SelectField: React.FC<{
    label: string;
    name: string;
    value: string;
    options: (StudyLevel | Destination | Course)[];
    icon: React.ReactNode;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  }> = ({ label, name, value, options, icon, onChange }) => (
    <div className="space-y-2">
      <label className="flex items-center text-gray-700 text-sm font-medium mb-1">
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md p-2"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {'name' in opt ? opt.name : (opt as Course).courseName}
          </option>
        ))}
      </select>
    </div>
  );

  // Show skeleton until component is mounted and data is ready
  if (!isMounted) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center mb-2">
                  <span className="w-5 h-5 bg-gray-300 rounded-full mr-2"></span>
                  <span className="w-24 h-4 bg-gray-300 rounded"></span>
                </div>
                <div className="w-full h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      {isEditMode ? <EditMode /> : <ViewMode />}
    </div>
  );
};

export default Profile;

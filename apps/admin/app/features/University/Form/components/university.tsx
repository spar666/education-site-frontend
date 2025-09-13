'use client';

import { Button, Col, Row, notification, Input } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  useWatch,
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadFile } from 'antd/es/upload/interface';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCSelect from 'apps/admin/components/SCForm/SCSelect';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg';
import { fetchCourses } from 'apps/admin/app/api/Course';
import { fetchAllUniversityByDestination } from 'apps/admin/app/api/Destinations';
import {
  addUniversity,
  fetchUniversityById,
  updateUniversity,
} from 'apps/admin/app/api/University';
import { renderImage } from 'libs/services/helper';
import React from 'react';

// Simplified Zod schema for form validation
const UniversitySchema = z.object({
  universityName: z.string().min(1, 'University name is required'),
  worldRanking: z.number().min(1, 'World ranking is required'),
  universityImage: z.array(z.any()).min(1, 'University image is required'),
  description: z.string().min(1, 'Description is required'),
  courses: z.array(z.any()).default([]),
  destination: z.string().default(''),
  campuses: z.array(z.any()).default([]),
});

type UniversityFormData = z.infer<typeof UniversitySchema>;

// Simplified type definitions
interface Course {
  id: string;
  courseName: string;
}

interface Campus {
  id?: string;
  location?: string | undefined;
  email?: string | undefined;
  contact?: string | undefined;
}

interface Destination {
  id: string;
  name: string;
}

interface UniversityImage extends UploadFile {
  publicId?: string;
}

interface UniversityResponse {
  universityName: string;
  universityAddress: string;
  universityContactNumber: string;
  universityEmail: string;
  worldRanking: number;
  universityImage: string;
  description: string;
  courseSubject: { course: { id: string }; courseContents: string }[];
  destination: { name: string };
  campuses?: Campus[];
}

interface ApiError {
  message: string;
  status?: number;
}

interface UniversityPayload {
  id?: string;
  universityName: string;
  universityAddress: string;
  universityContactNumber: string;
  universityEmail: string;
  worldRanking: number;
  universityImage: string;
  description: string;
  courses: { courses: string; courseContents: string }[];
  destination: string;
  campuses: Campus[];
}

// Helper function to map size to dimensions
const getImageDimensions = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'lg':
      return { width: 1200, height: 800 }; // Adjust dimensions as needed
    case 'md':
      return { width: 800, height: 600 };
    case 'sm':
      return { width: 400, height: 300 };
    default:
      return { width: 1200, height: 800 }; // Fallback
  }
};

// Define UniversityForm props
interface UniversityFormProps {}

// Main component
const UniversityForm: React.FC<UniversityFormProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [loadingUniversityData, setLoadingUniversityData] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableDestinations, setAvailableDestinations] = useState<
    Destination[]
  >([]);
  const [newDestination, setNewDestination] = useState('');
  const [showNewDestination, setShowNewDestination] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UniversitySchema),
    defaultValues: {
      universityName: '',
      worldRanking: 0,
      universityImage: [],
      description: '',
      courses: [],
      destination: '',
      campuses: [],
    },
  });

  const {
    fields: courseFields,
    append: appendCourse,
    remove: removeCourse,
  } = useFieldArray({ control, name: 'courses' });

  const {
    fields: campusFields,
    append: appendCampus,
    remove: removeCampus,
  } = useFieldArray({ control, name: 'campuses' });

  // Fetch initial data (courses and destinations)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [courses, destinations] = await Promise.all([
          fetchCourses({}),
          fetchAllUniversityByDestination(),
        ]);
        setAvailableCourses(courses);
        setAvailableDestinations(destinations);
      } catch (error: unknown) {
        const err = error as ApiError;
        console.error('Failed to fetch initial data:', err);
        notification.error({
          message: err.message || 'Failed to load required data',
        });
      }
    };
    fetchInitialData();
  }, []);

  // Fetch university data for editing
  useEffect(() => {
    if (id) {
      const fetchUniversityData = async () => {
        setLoadingUniversityData(true);
        try {
          const uniData: UniversityResponse = await fetchUniversityById({ id });
          console.log('Fetched university data:', uniData);
          
          const cover = uniData?.universityImage;
          console.log('University image path:', cover);
          console.log('Image path type:', typeof cover);
          console.log('Image path length:', cover?.length);

          const formattedCover = cover
            ? [
                {
                  uid: cover,
                  name: cover.split('/').pop() || 'university-image',
                  status: 'done' as const,
                  url: renderImage({
                    imgPath: cover,
                    ...getImageDimensions('lg'),
                  }),
                  publicId: cover,
                },
              ]
            : [];

          console.log('Formatted cover image:', formattedCover);

          // Reset form with fetched data
          const formData = {
            universityName: uniData?.universityName || '',
            worldRanking: uniData?.worldRanking || 0,
            description: uniData?.description || '',
            universityImage: formattedCover,
            courses:
              uniData?.courseSubject?.map((courseSubject) => ({
                courses: courseSubject.course.id,
                courseContents: courseSubject.courseContents,
              })) || [],
            destination: uniData?.destination?.name || '',
            campuses: uniData?.campuses || [],
          };
          
          console.log('Setting form data:', formData);
          
          // Reset form with fetched data
          reset(formData);
          
          // Use setTimeout to ensure form is properly initialized before setting individual values
          setTimeout(() => {
            console.log('Setting individual form values...');
            setValue('universityName', uniData?.universityName || '');
            setValue('worldRanking', uniData?.worldRanking || 0);
            setValue('description', uniData?.description || '');
            setValue('universityImage', formattedCover);
            setValue('courses', uniData?.courseSubject?.map((courseSubject) => ({
              courses: courseSubject.course.id,
              courseContents: courseSubject.courseContents,
            })) || []);
            setValue('destination', uniData?.destination?.name || '');
            setValue('campuses', uniData?.campuses || []);
            
            console.log('Form values set successfully');
            console.log('Current form values:', {
              universityName: uniData?.universityName,
              worldRanking: uniData?.worldRanking,
              description: uniData?.description,
              universityImage: formattedCover,
              destination: uniData?.destination?.name,
            });
          }, 100);
        } catch (error: unknown) {
          const err = error as ApiError;
          console.error('Failed to fetch university data:', err);
          notification.error({
            message: err.message || 'Failed to load university data',
          });
        } finally {
          setLoadingUniversityData(false);
        }
      };
      fetchUniversityData();
    }
  }, [id, reset]);

  const handleImageUpload = useCallback(
    (publicId: string, imageUrl?: string) => {
      console.log('Image upload callback:', { publicId, imageUrl });
      
      if (!publicId) {
        notification.error({
          message: 'Upload Failed',
          description: 'Failed to get image URL. Please try again.',
        });
        return;
      }

      const finalUrl = imageUrl || renderImage({
        imgPath: publicId,
        ...getImageDimensions('lg'),
      });

      console.log('Final image URL:', finalUrl);

      const newImage = {
        uid: publicId,
        name: publicId.split('/').pop() || 'university-image',
        status: 'done' as const,
        url: finalUrl,
        publicId,
      };
      
      console.log('New image object:', newImage);
      
      setValue('universityImage', [newImage]);
      notification.success({
        message: 'Upload Successful',
        description: 'University image has been uploaded',
      });
    },
    [setValue]
  );

  // File size validation function
  const validateFileSize = useCallback((file: File) => {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      notification.error({
        message: 'File Too Large',
        description: `Please select a file smaller than 2MB. Current file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      });
      return false;
    }
    return true;
  }, []);

  const onSubmit: SubmitHandler<UniversityFormData> = async (data) => {
    setLoading(true);
    try {
      console.log('Form data being submitted:', data);

      if (!data.universityImage?.[0]?.publicId) {
        throw new Error('University image is required');
      }

      // Clean and validate campus data
      // Clean and validate all data
      const cleanedCampuses =
        data.campuses
          ?.filter(
            (campus) => campus.location || campus.email || campus.contact
          )
          .map((campus) => ({
            location: campus.location?.trim() || '',
            email: campus.email?.trim() || '',
            contact: campus.contact?.trim() || '',
          })) || [];

      const cleanedCourses =
        data.courses
          ?.filter((course) => course.courses || course.courseContents)
          .map((course) => ({
            courses: course.courses?.trim() || '',
            courseContents: course.courseContents?.trim() || '',
          })) || [];

      const universityData: UniversityPayload = {
        universityName: data.universityName.trim(),
        worldRanking: data.worldRanking,
        universityImage: data.universityImage[0].publicId,
        description: data.description.trim(),
        courses: cleanedCourses,
        destination: data.destination.trim(), // This will now contain the actual destination name
        campuses: cleanedCampuses,
        // Required by UniversityPayload interface
        universityAddress: '',
        universityContactNumber: '',
        universityEmail: '',
        ...(id && { id }),
      };

      if (id) {
        await updateUniversity(universityData);
        notification.success({ message: 'University updated successfully' });
      } else {
        await addUniversity(universityData);
        notification.success({ message: 'University created successfully' });
      }
      router.push('/university');
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error('Failed to submit university:', err);
      notification.error({ message: err.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const addNewDestination = useCallback(() => {
    if (newDestination.trim()) {
      const newId = `new-${Date.now()}`;
      const newDest: Destination = { id: newId, name: newDestination.trim() };
      setAvailableDestinations((prev) => [...prev, newDest]);
      setValue('destination', newDestination.trim()); // Use the actual name, not the ID
      setNewDestination('');
      setShowNewDestination(false);
      notification.success({ 
        message: 'Destination Added', 
        description: `${newDestination.trim()} has been added to the list` 
      });
    } else {
      notification.error({ message: 'Please enter a valid destination name' });
    }
  }, [newDestination, setValue]);

  const watchedCourses = useWatch({ control, name: 'courses' }) || [];
  const selectedCourseIds: string[] = watchedCourses
    .map((course) => course.courses)
    .filter((id): id is string => typeof id === 'string' && !!id);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {loadingUniversityData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Loading university data...</span>
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm max-w-7xl mx-auto relative"
      >
        {/* Header Section */}
        <div className="border-b border-gray-200 px-8 py-6 bg-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900">
              {id ? 'Edit' : 'Create'} University
            </h3>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">
                Basic Information
              </h4>
            </div>
            <div className="p-6">
              <UniversityBasicInfo
                register={register}
                control={control}
                errors={errors}
              />
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Description</h4>
            </div>
            <div className="p-6">
              <SCWysiwyg
                name="description"
                register={register}
                control={control}
                parentClass="flex-grow"
                label="Description"
                error={errors?.description?.message}
              />
            </div>
          </div>

          {/* Campus Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">
                Campus Information
              </h4>
            </div>
            <div className="p-6">
              <CampusesSection
                campusFields={campusFields}
                register={register}
                control={control}
                errors={errors}
                removeCampus={removeCampus}
                appendCampus={appendCampus}
              />
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Courses</h4>
            </div>
            <div className="p-6">
              <CoursesSection
                courseFields={courseFields}
                availableCourses={availableCourses}
                selectedCourseIds={selectedCourseIds}
                register={register}
                control={control}
                errors={errors}
                removeCourse={removeCourse}
                appendCourse={appendCourse}
              />
            </div>
          </div>

          {/* Destination Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Destination</h4>
            </div>
            <div className="p-6">
              <DestinationSection
                availableDestinations={availableDestinations}
                showNewDestination={showNewDestination}
                newDestination={newDestination}
                register={register}
                control={control}
                errors={errors}
                setShowNewDestination={setShowNewDestination}
                setNewDestination={setNewDestination}
                addNewDestination={addNewDestination}
                setValue={setValue}
                watch={watch}
              />
            </div>
          </div>

          {/* University Image Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">
                University Image
              </h4>
            </div>
            <div className="p-6">
              <SCUpload
                name="universityImage"
                control={control}
                label="Main Image (Max 2MB)"
                error={
                  errors.universityImage && 'message' in errors.universityImage
                    ? errors.universityImage.message
                    : undefined
                }
                cropAspect={16 / 9}
                folder="university"
                onFileUpload={handleImageUpload}
                multiple={false}
                defaultFileList={(() => {
                  const fileList = watch('universityImage') || [];
                  console.log('SCUpload defaultFileList:', fileList);
                  return fileList;
                })()}
                required
              />
              <div className="mt-2 text-sm text-gray-500">
                <p>• Maximum file size: 2MB</p>
               
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-8 py-4">
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => router.push('/university')}
                  className="px-6 hover:bg-gray-100 min-w-[100px]"
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  loading={loading}
                  htmlType="submit"
                  type="primary"
                  size="large"
                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                >
                  {loading ? 'Saving...' : id ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Simplified sub-component props
interface UniversityBasicInfoProps {
  register: any;
  control: any;
  errors: any;
}

interface CampusesSectionProps {
  campusFields: { id: string }[];
  register: any;
  control: any;
  errors: any;
  removeCampus: (index: number) => void;
  appendCampus: (value: Campus) => void;
}

interface CampusFieldProps {
  index: number;
  register: any;
  control: any;
  errors: any;
}

interface CoursesSectionProps {
  courseFields: { id: string }[];
  availableCourses: Course[];
  selectedCourseIds: string[];
  register: any;
  control: any;
  errors: any;
  removeCourse: (index: number) => void;
  appendCourse: (value: { courses: string; courseContents: string }) => void;
}

interface DestinationSectionProps {
  availableDestinations: Destination[];
  showNewDestination: boolean;
  newDestination: string;
  register: any;
  control: any;
  errors: any;
  setShowNewDestination: (value: boolean) => void;
  setNewDestination: (value: string) => void;
  addNewDestination: () => void;
  setValue: any;
  watch: any;
}

interface FormActionsProps {
  loading: boolean;
  id: string | null;
  router: ReturnType<typeof useRouter>;
}

// Sub-components
const UniversityBasicInfo: React.FC<UniversityBasicInfoProps> = ({
  register,
  control,
  errors,
}) => (
  <Row gutter={[24, 24]}>
    <Col xs={24} lg={12}>
      <SCInput
        register={register}
        name="universityName"
        control={control}
        label="University Name"
        error={errors.universityName?.message}
        placeholder="Enter university name"
        size="large"
        required
      />
    </Col>
    <Col xs={24} lg={12}>
      <SCInput
        register={register}
        name="worldRanking"
        control={control}
        label="World Ranking"
        error={errors.worldRanking?.message}
        placeholder="Enter world ranking"
        size="large"
        type="number"
        required
      />
    </Col>
  </Row>
);

const CampusesSection: React.FC<CampusesSectionProps> = ({
  campusFields,
  register,
  control,
  errors,
  removeCampus,
  appendCampus,
}) => (
  <div className="space-y-6">
    {campusFields.map((campus, index) => (
      <div
        key={campus.id}
        className={`bg-gray-50 rounded-lg p-6 relative ${
          index > 0 ? 'mt-6' : ''
        }`}
      >
        {index > 0 && (
          <Button
            type="text"
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            onClick={() => removeCampus(index)}
            icon={
              <CloseOutlined
                
                
              />
            }
          />
        )}
        <Row gutter={[24, 24]}>
          <CampusField
            index={index}
            register={register}
            control={control}
            errors={errors}
          />
        </Row>
      </div>
    ))}
    <Button
      onClick={() => appendCampus({ location: '', email: '', contact: '' })}
      type="dashed"
      className="w-full mt-4"
      size="large"
    >
      + Add New Campus
    </Button>
  </div>
);

const CampusField: React.FC<CampusFieldProps> = ({
  index,
  register,
  control,
  errors,
}) => (
  <>
    <Col xs={24} lg={8}>
      <SCInput
        register={register}
        name={`campuses.${index}.location`}
        control={control}
        label="Location"
        error={errors.campuses?.[index]?.location?.message}
        placeholder="Enter campus location"
        size="large"
      />
    </Col>
    <Col xs={24} lg={8}>
      <SCInput
        register={register}
        name={`campuses.${index}.email`}
        control={control}
        label="Email"
        error={errors.campuses?.[index]?.email?.message}
        placeholder="Enter campus email"
        size="large"
      />
    </Col>
    <Col xs={24} lg={8}>
      <SCInput
        register={register}
        name={`campuses.${index}.contact`}
        control={control}
        label="Contact"
        error={errors.campuses?.[index]?.contact?.message}
        placeholder="Enter campus contact"
        size="large"
      />
    </Col>
  </>
);

const CoursesSection: React.FC<CoursesSectionProps> = ({
  courseFields,
  availableCourses,
  selectedCourseIds,
  register,
  control,
  errors,
  removeCourse,
  appendCourse,
}) => (
  <div className="space-y-6">
    {courseFields.map((course, index) => {
      const otherSelectedCourseIds = selectedCourseIds.filter(
        (_: string, i: number) => i !== index
      );

      return (
        <div
          key={course.id}
          className="bg-gray-50 rounded-lg border border-gray-200 p-6 relative transition-shadow hover:shadow-sm"
        >
          <Button
            type="text"
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => removeCourse(index)}
            icon={
              <CloseOutlined
                
                
              />
            }
          />
          <div className="space-y-6">
            <div className="bg-white rounded-md p-4 border border-gray-100">
              <SCSelect
                register={register}
                control={control}
                name={`courses.${index}.courses`}
                label="Course Name"
                error={errors.courses?.[index]?.courses?.message}
                allowClear
                placeholder="Select a course"
                size="large"
                options={availableCourses.map((course: Course) => ({
                  label: course.courseName,
                  value: course.id,
                  disabled: otherSelectedCourseIds.includes(course.id),
                }))}
              />
            </div>
            <div className="bg-white rounded-md p-4 border border-gray-100">
              <SCWysiwyg
                name={`courses.${index}.courseContents`}
                register={register}
                control={control}
                parentClass="flex-grow"
                label="Course Description"
                error={errors.courses?.[index]?.courseContents?.message}
              />
            </div>
          </div>
        </div>
      );
    })}
    <Button
      onClick={() => appendCourse({ courses: '', courseContents: '' })}
      type="dashed"
      className="w-full h-12 text-base hover:border-blue-400 hover:text-blue-500 transition-colors"
      icon={
        <PlusOutlined
          
          
        />
      }
    >
      Add New Course
    </Button>
  </div>
);

const DestinationSection: React.FC<DestinationSectionProps> = ({
  availableDestinations,
  showNewDestination,
  newDestination,
  register,
  control,
  errors,
  setShowNewDestination,
  setNewDestination,
  addNewDestination,
  setValue,
  watch,
}) => {
  const selectedDestination = watch('destination');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md p-4 border border-gray-100">
        <SCSelect
          register={register}
          name="destination"
          control={control}
          label="Select Destination"
          error={errors.destination?.message}
          allowClear
          placeholder="Choose a destination"
          size="large"
          notFoundContent={null}
          options={[
            ...availableDestinations.map((dest) => ({
              label: dest.name,
              value: dest.id,
            })),
            { label: '+ Add New Destination', value: 'new' },
          ]}
          onChange={(value: string) => {
            if (value === 'new') {
              setShowNewDestination(true);
              setValue('destination', '');
            } else {
              // Find the destination by ID and set the name
              const selectedDest = availableDestinations.find(dest => dest.id === value);
              setValue('destination', selectedDest ? selectedDest.name : value);
              setShowNewDestination(false);
            }
          }}
          value={availableDestinations.find(dest => dest.name === selectedDestination)?.id || selectedDestination}
          required
        />
      </div>

      {showNewDestination && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all">
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              Add a new destination that will be available for all universities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              className="flex-1"
              size="large"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder="Enter new destination name (e.g., Canada, Germany, etc.)"
            />
            <Button
              type="primary"
              onClick={addNewDestination}
              size="large"
              className="bg-blue-600 hover:bg-blue-700 border-none min-w-[100px]"
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const FormActions: React.FC<FormActionsProps> = ({ loading, id, router }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-8 py-4">
      <div className="flex justify-end space-x-4">
        <Button
          onClick={() => router.push('/university')}
          className="px-6 hover:bg-gray-100 min-w-[100px]"
          size="large"
        >
          Cancel
        </Button>
        <Button
          loading={loading}
          htmlType="submit"
          type="primary"
          size="large"
          className="px-8 bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
        >
          {loading ? 'Saving...' : id ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  </div>
);

export default UniversityForm;

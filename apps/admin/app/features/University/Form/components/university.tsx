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

// Zod schema for form validation
const UniversitySchema = z.object({
  universityName: z.string().min(1, 'University name is required'),

  worldRanking: z
    .number({ invalid_type_error: 'World ranking must be a number' })
    .min(1, 'World ranking is required'),
  universityImage: z
    .array(
      z.object({
        uid: z.string(),
        name: z.string(),
        status: z.enum(['done', 'uploading', 'error', 'removed']),
        url: z.string(),
        thumbUrl: z.string().optional(),
        size: z.number().optional(),
        type: z.string().optional(),
        percent: z.number().optional(),
        originFileObj: z.any().optional(),
        response: z.any().optional(),
        error: z.any().optional(),
        publicId: z.string().optional(),
      })
    )
    .min(1, 'University image is required'),
  description: z.string().min(1, 'Description is required'),
  courses: z
    .array(
      z.object({
        courses: z.string().optional(),
        courseContents: z.string().optional(),
      })
    )
    .optional()
    .default([]),
  destination: z.string().optional().default(''),
  campuses: z
    .array(
      z.object({
        location: z.string().optional(),
        email: z.string().email('Invalid email if provided').optional(),
        contact: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

type UniversityFormData = z.infer<typeof UniversitySchema>;

// Type definitions
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
  } = useForm<UniversityFormData>({
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
        try {
          const uniData: UniversityResponse = await fetchUniversityById({ id });
          const cover = uniData?.universityImage;

          const formattedCover: UniversityImage[] = cover
            ? [
                {
                  uid: cover,
                  name: cover.split('/').pop() || 'university-image',
                  status: 'done',
                  url: renderImage({
                    imgPath: cover,
                    ...getImageDimensions('lg'), // Map size to dimensions
                  }),
                  publicId: cover,
                },
              ]
            : [];

          reset({
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
          });
        } catch (error: unknown) {
          const err = error as ApiError;
          console.error('Failed to fetch university data:', err);
          notification.error({
            message: err.message || 'Failed to load university data',
          });
        }
      };
      fetchUniversityData();
    }
  }, [id, reset]);

  const handleImageUpload = useCallback(
    (publicId: string) => {
      if (!publicId) {
        notification.error({
          message: 'Upload Failed',
          description: 'Failed to get image URL. Please try again.',
        });
        return;
      }

      const newImage = {
        uid: publicId,
        name: publicId.split('/').pop() || 'university-image',
        status: 'done' as const,
        url: renderImage({
          imgPath: publicId,
          ...getImageDimensions('lg'),
        }),
        publicId,
      };
      setValue('universityImage', [newImage]);
      notification.success({
        message: 'Upload Successful',
        description: 'University image has been uploaded',
      });
    },
    [setValue]
  );

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
        destination: data.destination.trim(),
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
      const newDest: Destination = { id: newId, name: newDestination };
      setAvailableDestinations((prev) => [...prev, newDest]);
      setValue('destination', newId);
      setNewDestination('');
      setShowNewDestination(false);
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
                label="Main Image"
                error={
                  errors.universityImage && 'message' in errors.universityImage
                    ? errors.universityImage.message
                    : undefined
                }
                cropAspect={16 / 9}
                folder="university"
                onFileUpload={handleImageUpload}
                multiple={false}
                defaultFileList={watch('universityImage') || []}
                required
              />
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

// Sub-component props
interface UniversityBasicInfoProps {
  register: UseFormRegister<UniversityFormData>;
  control: Control<UniversityFormData>;
  errors: FieldErrors<UniversityFormData>;
}

interface CampusesSectionProps {
  campusFields: { id: string }[];
  register: UseFormRegister<UniversityFormData>;
  control: Control<UniversityFormData>;
  errors: FieldErrors<UniversityFormData>;
  removeCampus: (index: number) => void;
  appendCampus: (value: Campus) => void;
}

interface CampusFieldProps {
  index: number;
  register: UseFormRegister<UniversityFormData>;
  control: Control<UniversityFormData>;
  errors: FieldErrors<UniversityFormData>;
}

interface CoursesSectionProps {
  courseFields: { id: string }[];
  availableCourses: Course[];
  selectedCourseIds: string[];
  register: UseFormRegister<UniversityFormData>;
  control: Control<UniversityFormData>;
  errors: FieldErrors<UniversityFormData>;
  removeCourse: (index: number) => void;
  appendCourse: (value: { courses: string; courseContents: string }) => void;
}

interface DestinationSectionProps {
  availableDestinations: Destination[];
  showNewDestination: boolean;
  newDestination: string;
  register: UseFormRegister<UniversityFormData>;
  control: Control<UniversityFormData>;
  errors: FieldErrors<UniversityFormData>;
  setShowNewDestination: (value: boolean) => void;
  setNewDestination: (value: string) => void;
  addNewDestination: () => void;
  setValue: UseFormSetValue<UniversityFormData>;
  watch: UseFormWatch<UniversityFormData>;
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
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
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
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
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
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
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
              setValue('destination', value);
              setShowNewDestination(false);
            }
          }}
          value={selectedDestination}
          required
        />
      </div>

      {showNewDestination && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all">
          <div className="flex items-center gap-3">
            <Input
              className="flex-1"
              size="large"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder="Enter new destination name"
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

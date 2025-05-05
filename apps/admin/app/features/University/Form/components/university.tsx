'use client';

import { Button, Col, Row, notification, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
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
        courses: z.string().min(1, 'Course selection is required'),
        courseContents: z.string().min(1, 'Course description is required'),
      })
    )
    .min(1, 'At least one course is required'),
  destination: z.string().min(1, 'Destination is required'),
  campuses: z
    .array(
      z.object({
        location: z.string().min(1, 'Campus location is required'),
        email: z
          .string()
          .email('Invalid email')
          .min(1, 'Campus email is required'),
        contact: z.string().min(1, 'Campus contact is required'),
      })
    )
    .min(1, 'At least one campus is required'),
});

type UniversityFormData = z.infer<typeof UniversitySchema>;

// Type definitions
interface Course {
  id: string;
  courseName: string;
}

interface Campus {
  id?: string;
  location: string;
  email: string;
  contact: string;
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
  campuses: Campus[];
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
      const newImage: any = {
        uid: publicId,
        name: publicId.split('/').pop() || 'university-image',
        status: 'done',
        url: renderImage({
          imgPath: publicId,
          ...getImageDimensions('lg'), // Map size to dimensions
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
      const universityData: any = {
        universityName: data.universityName,
        worldRanking: data.worldRanking,
        universityImage: data.universityImage[0]?.publicId || '',
        description: data.description,
        courses: data.courses,
        destination: data.destination,
        campuses: data.campuses,
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
  const selectedCourseIds = watchedCourses
    .map((course) => course.courses)
    .filter(Boolean);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 pb-8">
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Create'} University
      </h3>

      <UniversityBasicInfo
        register={register}
        control={control}
        errors={errors}
      />

      <SCWysiwyg
        name="description"
        register={register}
        control={control}
        parentClass="flex-grow mb-4"
        label="Description"
        error={errors?.description?.message}
      />

      <CampusesSection
        campusFields={campusFields}
        register={register}
        control={control}
        errors={errors}
        removeCampus={removeCampus}
        appendCampus={appendCampus}
      />

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

      <SCUpload
        name="universityImage"
        control={control}
        label="University Image"
        error={
          errors.universityImage && 'message' in errors.universityImage
            ? errors.universityImage.message
            : undefined
        }
        cropAspect={1}
        folder="university"
        onFileUpload={handleImageUpload}
        multiple={false}
        defaultFileList={watch('universityImage') || []}
        required
      />

      <FormActions loading={loading} id={id} router={router} />
    </form>
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
  <Row gutter={[20, 20]}>
    <Col xs={24} xl={12}>
      <SCInput
        register={register}
        name="universityName"
        control={control}
        label="University Name"
        error={errors.universityName?.message}
        placeholder="University Name"
        size="large"
        required
      />
    </Col>
    <Col xs={24} xl={12}>
      <SCInput
        register={register}
        name="worldRanking"
        control={control}
        label="World Ranking"
        error={errors.worldRanking?.message}
        placeholder="World Ranking"
        size="large"
        type="number"
        required
      />
    </Col>
    {/* <Col xs={24} xl={12}>
      <SCInput
        register={register}
        name="universityAddress"
        control={control}
        label="Address"
        error={errors.universityAddress?.message}
        placeholder="University Address"
        size="large"
        required
      />
    </Col>
    <Col xs={24} xl={12}>
      <SCInput
        register={register}
        name="universityContactNumber"
        control={control}
        label="Contact Number"
        error={errors.universityContactNumber?.message}
        placeholder="Contact Number"
        size="large"
        required
      />
    </Col>
    <Col xs={24} xl={12}>
      <SCInput
        register={register}
        name="universityEmail"
        control={control}
        label="Email"
        error={errors.universityEmail?.message}
        placeholder="Email"
        size="large"
        required
      />
    </Col> */}
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
  <>
    <h3 className="text-xl font-bold mt-7 py-8 m-0">Campuses</h3>
    {campusFields.map((campus, index) => (
      <React.Fragment key={campus.id}>
        <Row gutter={[20, 20]} align="middle">
          <CampusField
            index={index}
            register={register}
            control={control}
            errors={errors}
          />
          {index > 0 && (
            <Col xs={2} xl={1}>
              <Button
                type="text"
                style={{ color: 'red' }}
                onClick={() => removeCampus(index)}
                icon={
                  <CloseOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              />
            </Col>
          )}
        </Row>
      </React.Fragment>
    ))}
    <Button
      onClick={() => appendCampus({ location: '', email: '', contact: '' })}
      style={{ marginBottom: '20px' }}
    >
      Add Campus
    </Button>
  </>
);

const CampusField: React.FC<CampusFieldProps> = ({
  index,
  register,
  control,
  errors,
}) => (
  <>
    <Col xs={22} xl={11}>
      <SCInput
        register={register}
        name={`campuses.${index}.location`}
        control={control}
        label="Location"
        error={errors.campuses?.[index]?.location?.message}
        placeholder="Campus Location"
        size="large"
      />
    </Col>
    <Col xs={22} xl={11}>
      <SCInput
        register={register}
        name={`campuses.${index}.email`}
        control={control}
        label="Email"
        error={errors.campuses?.[index]?.email?.message}
        placeholder="Campus Email"
        size="large"
      />
    </Col>
    <Col xs={22} xl={11}>
      <SCInput
        register={register}
        name={`campuses.${index}.contact`}
        control={control}
        label="Contact"
        error={errors.campuses?.[index]?.contact?.message}
        placeholder="Campus Contact"
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
  <>
    <h3 className="text-xl font-bold mt-7 py-8 m-0">Courses</h3>
    {courseFields.map((course, index) => {
      const otherSelectedCourseIds = selectedCourseIds.filter(
        (_: string, i: number) => i !== index
      );

      return (
        <React.Fragment key={course.id}>
          <Row gutter={[20, 20]} align="middle">
            <Col xs={22} xl={11}>
              <SCSelect
                register={register}
                control={control}
                name={`courses.${index}.courses`}
                label="Course"
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
            </Col>
            <Col xs={2} xl={1}>
              <Button
                type="text"
                style={{ color: 'red' }}
                onClick={() => removeCourse(index)}
                icon={
                  <CloseOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              />
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col xs={24}>
              <SCWysiwyg
                name={`courses.${index}.courseContents`}
                register={register}
                control={control}
                parentClass="flex-grow mb-4"
                label="Course Description"
                error={errors.courses?.[index]?.courseContents?.message}
              />
            </Col>
          </Row>
        </React.Fragment>
      );
    })}
    <Button
      onClick={() => appendCourse({ courses: '', courseContents: '' })}
      style={{ marginBottom: '20px' }}
    >
      Add Course
    </Button>
  </>
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
    <>
      <h3 className="text-xl font-bold mt-7 py-8 m-0">Destination</h3>
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCSelect
            register={register}
            parentClass="flex-grow mb-4"
            name="destination"
            control={control}
            label="Destination"
            error={errors.destination?.message}
            allowClear
            placeholder="Select destination"
            size="large"
            notFoundContent={null}
            options={[
              ...availableDestinations.map((dest) => ({
                label: dest.name,
                value: dest.id,
              })),
              { label: 'Add new destination...', value: 'new' },
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
          {showNewDestination && (
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Input
                style={{ flex: 'auto' }}
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="New destination name"
              />
              <Button type="link" onClick={addNewDestination}>
                Add
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

const FormActions: React.FC<FormActionsProps> = ({ loading, id, router }) => (
  <Row>
    <div className="flex mt-4">
      <Button loading={loading} htmlType="submit" type="primary" size="large">
        {id ? 'Update' : 'Create'}
      </Button>
      <Button
        onClick={() => router.push('/university')}
        className="ml-4"
        size="large"
      >
        Cancel
      </Button>
    </div>
  </Row>
);

export default UniversityForm;

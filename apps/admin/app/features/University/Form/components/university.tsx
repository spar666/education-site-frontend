'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, Row, notification, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCSelect from 'apps/admin/components/SCForm/SCSelect';
import SCUpload from 'apps/admin/components/SCForm/SCUpload';
import SCTextArea from 'apps/admin/components/SCForm/SCTextArea';
import { fetchCourses } from 'apps/admin/app/api/Course';
import { fetchAllUniversityByDestination } from 'apps/admin/app/api/Destinations';
import {
  addUniversity,
  fetchUniversityById,
  updateUniversity,
} from 'apps/admin/app/api/University';
import { renderImage } from 'libs/services/helper';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg/index';

interface Course {
  courses: string;
  courseContents: string;
}

interface Campus {
  location: string;
  email: string;
  contact: string;
}

interface ICreateUniversity {
  universityName: string;
  universityAddress: string;
  universityContactNumber: string;
  universityEmail: string;
  worldRanking: number;
  universityImage: any;
  description: string;
  courses: Course[];
  destination: string;
  campuses: Campus[];
}

interface Destination {
  name: string;
  id: string;
}

const UniversityForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [uniImage, setUniImage] = useState<string | null>(null);
  const [availableCourse, setAvailableCourse] = useState<any[]>([]);
  const [newDestination, setNewDestination] = useState('');
  const [newDestinationVisible, setNewDestinationVisible] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination>({
    name: '',
    id: '',
  });
  const [availableDestination, setAvailableDestination] = useState<any>([]);
  const [uniCampuses, setUniCampuses] = useState<Campus[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<ICreateUniversity>();
  const {
    fields: courseFields,
    append: appendCourse,
    remove: removeCourse,
  } = useFieldArray({
    control,
    name: 'courses',
  });
  const {
    fields: campusFields,
    append: appendCampus,
    remove: removeCampus,
  } = useFieldArray({ control, name: 'campuses' });

  // Fetch initial data for courses and destinations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, destinationsResponse] = await Promise.all([
          fetchCourses({}),
          fetchAllUniversityByDestination(),
        ]);
        setAvailableCourse(courseResponse);
        setAvailableDestination(destinationsResponse);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  console.log(availableCourse, 'acccc');

  // Fetch university data if id is present
  useEffect(() => {
    if (id) {
      fetchUniversityById({ id }).then((response) => {
        console.log(response, 'response');
        const uniData = response;
        setUniImage(uniData?.universityImage);
        const formattedCover = [
          {
            uid: uniData?.universityImage,
            url: renderImage({
              imgPath: uniData?.universityImage,
              size: 'lg',
            }) as string,
          },
        ];

        const courses = uniData?.courseSubject.map((courseSubject: any) => {
          return {
            courses: courseSubject?.course?.id,
            courseContents: courseSubject?.courseContents,
          };
        });

        setSelectedCourses(courses);
        setSelectedDestination({
          name: uniData?.destination.name,
          id: uniData?.destination,
        });
        setUniCampuses(uniData?.campuses);

        reset({
          universityName: uniData?.universityName,
          universityAddress: uniData?.universityAddress,
          universityEmail: uniData?.universityEmail,
          universityContactNumber: uniData?.universityContactNumber,
          worldRanking: uniData?.worldRanking,
          description: uniData?.description,
          universityImage: formattedCover,
          courses,
          destination: uniData?.destination.id,
          campuses: uniData?.campuses,
        });
      });
    }
  }, [id, reset]);

  const handleImageUpload = (urls: string[]) => {
    setUploadedImageUrls(urls);
  };

  const handleFormSubmit = async (data: ICreateUniversity) => {
    setLoading(true);

    const courseArray = data.courses.map((course) => ({
      ...course,
      courseContents: course.courseContents,
    }));

    const imageUrl =
      uploadedImageUrls.length > 0 ? uploadedImageUrls : uniImage;
    console.log(courseArray, 'array');
    const universityData = {
      ...data,
      universityImage: imageUrl,
      courses: courseArray,
      destination: selectedDestination.name,
    };

    try {
      if (id) {
        const updatedData = { ...universityData, id };
        const response = await updateUniversity(updatedData);
        notification.success({ message: response.data.message });
      } else {
        const response = await addUniversity({ universityData });
        notification.success({ message: response.data.message });
      }
      router.push('/university');
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const appendCampusField = () => {
    appendCampus({ location: '', email: '', contact: '' });
  };

  // Watch courses outside the render loop
  const watchedCourses = useWatch({ control, name: 'courses' }) || [];

  // Get selected course IDs
  const selectedCourseIds = [
    ...watchedCourses.map((course) => course.courses),
    ...selectedCourses.map((course) => course.courses),
  ];
  console.log(selectedCourseIds);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white px-8 pb-8"
    >
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Create'} University
      </h3>
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCInput
            register={register}
            name="universityName"
            control={control}
            label="University Name"
            error={errors?.universityName?.message}
            placeholder="University Name"
            size="large"
            required
          />
        </Col>
      </Row>
      {/* <Row gutter={[20, 20]}>
        <Col xs={24}>
          <SCTextArea
            register={register}
            name="description"
            control={control}
            label="Description"
            error={errors?.description?.message}
            placeholder="Description"
            size="large"
            required
          />
        </Col>
      </Row> */}

      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <SCWysiwyg
            name="description"
            register={register}
            control={control}
            parentClass="flex-grow mb-4"
            label="Description"
            error={errors?.description?.message}
          />
        </Col>
      </Row>
      <Row gutter={[0, 0]}>
        <Col xs={24} xl={24}>
          <SCInput
            register={register}
            name="worldRanking"
            control={control}
            label="University World Ranking"
            error={errors?.worldRanking?.message}
            placeholder="University World Ranking"
            size="large"
            type="number"
            required
          />
        </Col>
      </Row>
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Add'} Campuses
      </h3>
      {campusFields.map((campus, index) => (
        <React.Fragment key={campus.id}>
          <Row gutter={[20, 20]} align="middle">
            <Col xs={22} xl={11}>
              <SCInput
                register={register}
                name={`campuses[${index}].location`}
                control={control}
                label="Campus Location"
                error={errors?.campuses?.[index]?.location?.message}
                placeholder="Campus Location"
                size="large"
              />
            </Col>
            <Col xs={22} xl={11}>
              <SCInput
                register={register}
                name={`campuses[${index}].email`}
                control={control}
                label="Campus Email"
                error={errors?.campuses?.[index]?.email?.message}
                placeholder="Campus Email"
                size="large"
              />
            </Col>
            <Col xs={22} xl={11}>
              <SCInput
                register={register}
                name={`campuses[${index}].contact`}
                control={control}
                label="Campus Contact Number"
                error={errors?.campuses?.[index]?.contact?.message}
                placeholder="Campus Contact Number"
                size="large"
              />
            </Col>
            <Col xs={2} xl={1}>
              {index > 0 && (
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
              )}
            </Col>
          </Row>
        </React.Fragment>
      ))}
      <Button onClick={appendCampusField}>Add Campus</Button>
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Add'} Courses
      </h3>
      {courseFields.map((course, courseIndex) => {
        const currentCourseId = watchedCourses[courseIndex]?.courses;

        // Compute other selected course IDs by excluding the current course ID
        const otherSelectedCourseIds = selectedCourseIds.filter(
          (id, index) => index !== courseIndex
        );
        console.log(otherSelectedCourseIds, 'selctec ourse');
        return (
          <React.Fragment key={course.id}>
            <Row gutter={[20, 20]} align="middle">
              <Col xs={22} xl={11}>
                <SCSelect
                  register={register}
                  control={control}
                  name={`courses[${courseIndex}].courses`}
                  label="Course"
                  error={errors?.courses?.[courseIndex]?.courses?.message}
                  allowClear
                  placeholder="Please select a course"
                  size="large"
                  options={availableCourse.map((ac: any) => ({
                    label: ac.courseName,
                    value: ac.id,
                    disabled: otherSelectedCourseIds.includes(ac.id),
                  }))}
                />
              </Col>
              <Col xs={2} xl={1}>
                <Button
                  type="text"
                  style={{ color: 'red' }}
                  onClick={() => removeCourse(courseIndex)}
                  icon={
                    <CloseOutlined
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  }
                />
              </Col>
            </Row>
            {otherSelectedCourseIds && (
              <Row gutter={[20, 20]}>
                <Col xs={24}>
                  <SCWysiwyg
                    name={`courses.${courseIndex}.courseContents`}
                    register={register}
                    control={control}
                    parentClass="flex-grow mb-4"
                    label="Course description"
                    error={
                      errors?.courses?.[courseIndex]?.courseContents?.message
                    }
                  />
                </Col>
              </Row>
            )}
          </React.Fragment>
        );
      })}

      <Button
        onClick={() =>
          appendCourse({
            courses: '',
            courseContents: '',
          })
        }
        style={{ marginBottom: '20px' }}
      >
        Add Course
      </Button>
      <h3 className="text-xl font-bold mt-7 py-8 m-0">
        {id ? 'Edit' : 'Add'} Destination
      </h3>
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <SCSelect
            register={register}
            parentClass="flex-grow mb-4"
            name="destination"
            control={control}
            label="Destination"
            error={errors?.destination?.message}
            allowClear
            placeholder="Please select destination"
            size="large"
            notFoundContent={null}
            options={[
              ...availableDestination?.map((ad: any) => ({
                label: ad.name,
                value: ad.id,
              })),
              { label: 'Add new destination...', value: 'new' }, // Option to add new destination
            ]}
            value={selectedDestination?.name || ''}
            onChange={(value) => {
              if (value === 'new') {
                // Logic to open the input field for new destination
                // You can manage the new destination state here
                setNewDestinationVisible(true);
              } else {
                setSelectedDestination(
                  availableDestination.find((ad: any) => ad.id === value)
                );
              }
            }}
            required
          />

          {newDestinationVisible && ( // Conditionally render the input for new destination
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Input
                style={{ flex: 'auto' }}
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="Add new destination"
              />
              <Button
                type="link"
                onClick={() => {
                  if (newDestination.trim()) {
                    const newId = `new-${availableDestination.length + 1}`; // Generate a new ID
                    setAvailableDestination((prev: any) => [
                      ...prev,
                      { id: newId, name: newDestination },
                    ]);
                    setSelectedDestination({ id: newId, name: newDestination });
                    setNewDestination('');
                    setNewDestinationVisible(false); // Hide the input field after adding
                  }
                }}
              >
                Add
              </Button>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <SCUpload
          register={register}
          name="universityImage"
          control={control as any}
          label="University Image"
          multiple
          error={errors?.universityImage?.message}
          cropAspect={1}
          onFileUpload={handleImageUpload}
        />
      </Row>
      <Row>
        <div className="flex mt-4">
          <Button
            loading={loading}
            htmlType="submit"
            type="primary"
            size="large"
          >
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
    </form>
  );
};

export default UniversityForm;

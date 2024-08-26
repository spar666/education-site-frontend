'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, Row, notification, Typography } from 'antd';
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
import SCCheckbox from 'apps/admin/components/SCForm/SCCheckbox';
import { fetchCourses } from 'apps/admin/app/api/Course';
import { fetchAllUniversityByDestination } from 'apps/admin/app/api/Destinations';
import {
  addUniversity,
  fetchUniversityById,
  updateUniversity,
} from 'apps/admin/app/api/University';
import { renderImage } from 'libs/services/helper';

const { Text } = Typography;

// Interfaces for form data structure
interface Subject {
  subjectName: string;
  description: string;
}

interface Course {
  courses: string;
  subjects: Subject[];
  tuitionFee: number;
  currency: string;
  financialAidAvailable: string;
  scholarshipDetails: string;
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
  const [availableCourse, setAvailableCourse] = useState<Course[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination>({
    name: '',
    id: '',
  });
  const [availableDestination, setAvailableDestination] = useState<
    Destination[]
  >([]);
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
          fetchCourses(),
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

  // Fetch university data if id is present
  useEffect(() => {
    if (id) {
      fetchUniversityById({ id }).then((response) => {
        const uniData = response.university;
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

        const courses = uniData.courses.map((course: any) => ({
          courses: course.id,
          subjects: course.universityCourseSubject.map((subject: any) => ({
            subjectName: subject.subject.subjectName || '',
            description: subject.subject.description || '',
          })),
          tuitionFee: course.financeDetails[0]?.tuitionFee || 0,
          currency: course.financeDetails[0]?.currency || '',
          financialAidAvailable: course.financeDetails[0]?.financialAidAvailable
            ? 'yes'
            : 'no',
          scholarshipDetails: course.financeDetails[0]?.scholarshipDetails
            ? 'yes'
            : 'no',
        }));

        setSelectedCourses(courses);
        setSelectedDestination({
          name: uniData.destination.name,
          id: uniData.destination,
        });
        setUniCampuses(uniData?.campuses);

        reset({
          universityName: uniData.universityName,
          universityAddress: uniData.universityAddress,
          universityEmail: uniData.universityEmail,
          universityContactNumber: uniData.universityContactNumber,
          worldRanking: uniData.worldRanking,
          description: uniData.description,
          universityImage: formattedCover,
          courses,
          destination: uniData.destination.id,
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
      financialAidAvailable: course.financialAidAvailable === 'yes',
      scholarshipDetails: course.scholarshipDetails === 'yes',
    }));

    const imageUrl =
      uploadedImageUrls.length > 0 ? uploadedImageUrls : uniImage;

    const universityData = {
      ...data,
      universityImage: imageUrl,
      courses: courseArray,
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
  const selectedCourseIds = watchedCourses.map((course) => course.courses);

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
      <Row gutter={[20, 20]}>
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
      {courseFields.map((course, courseIndex) => (
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
                options={availableCourse.map((ac) => ({
                  label: ac.courses,
                  value: ac.courses,
                  disabled: selectedCourseIds.includes(ac.courses), // Disable selected courses
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
          {watch(`courses.${courseIndex}.courses` as const) && (
            <>
              <h4 className="mt-4 text-xl font-bold">Financial Details</h4>
              <Row gutter={[20, 20]}>
                <Col xs={24} xl={12}>
                  <SCInput
                    register={register}
                    name={`courses.${courseIndex}.tuitionFee`}
                    control={control}
                    label="Tuition Fee"
                    error={errors?.courses?.[courseIndex]?.tuitionFee?.message}
                    placeholder="Tuition Fee"
                    size="large"
                    required
                    type="number"
                  />
                </Col>
                <Col xs={24} xl={12}>
                  <SCInput
                    register={register}
                    name={`courses.${courseIndex}.currency`}
                    control={control}
                    label="Currency"
                    error={errors?.courses?.[courseIndex]?.currency?.message}
                    placeholder="Currency"
                    size="large"
                    required
                  />
                </Col>
              </Row>
              <Row gutter={[20, 20]}>
                <Col xs={24} xl={12}>
                  <SCCheckbox
                    register={register}
                    name={`courses.${courseIndex}.financialAidAvailable`}
                    control={control}
                    label="Is Financial Aid Available?"
                    error={
                      errors?.courses?.[courseIndex]?.financialAidAvailable
                        ?.message
                    }
                    options={[
                      {
                        value: 'yes',
                        label: 'Yes',
                        description: 'Financial aid is available',
                      },
                      {
                        value: 'no',
                        label: 'No',
                        description: 'No financial aid available',
                      },
                    ]}
                  />
                </Col>
                <Col xs={24} xl={12}>
                  <SCCheckbox
                    register={register}
                    name={`courses.${courseIndex}.scholarshipDetails`}
                    control={control}
                    label="Is Scholarship Available?"
                    error={
                      errors?.courses?.[courseIndex]?.scholarshipDetails
                        ?.message
                    }
                    options={[
                      {
                        value: 'yes',
                        label: 'Yes',
                        description: 'Scholarship is available',
                      },
                      {
                        value: 'no',
                        label: 'No',
                        description: 'No scholarship available',
                      },
                    ]}
                  />
                </Col>
              </Row>
              <SubjectFields
                courseIndex={courseIndex}
                control={control}
                register={register}
                errors={errors}
              />
            </>
          )}
        </React.Fragment>
      ))}
      <Button
        onClick={() =>
          appendCourse({
            courses: '',
            subjects: [{ subjectName: '', description: '' }],
            tuitionFee: 0,
            currency: '',
            financialAidAvailable: 'no',
            scholarshipDetails: 'no',
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
            options={availableDestination?.map((ad) => ({
              label: ad.name,
              value: ad.id,
            }))}
            value={selectedDestination?.name}
            required
          />
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

interface SubjectFieldsProps {
  courseIndex: number;
  control: Control<ICreateUniversity>;
  register: UseFormRegister<ICreateUniversity>;
  errors: FieldErrors<ICreateUniversity>;
}

const SubjectFields: React.FC<SubjectFieldsProps> = ({
  courseIndex,
  control,
  register,
  errors,
}) => {
  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control,
    name: `courses[${courseIndex}].subjects`,
  });

  return (
    <>
      {subjectFields.map((subject, subjectIndex) => (
        <React.Fragment key={subject.id}>
          <Row gutter={[20, 20]} align="middle">
            <Col xs={22} xl={11}>
              <SCInput
                register={register}
                name={`courses[${courseIndex}].subjects[${subjectIndex}].subjectName`}
                control={control}
                label="Subject Name"
                error={
                  errors?.courses?.[courseIndex]?.subjects?.[subjectIndex]
                    ?.subjectName?.message
                }
                placeholder="Subject Name"
                size="large"
                required
              />
            </Col>
            <Col xs={2} xl={1}>
              <Button
                type="text"
                style={{ color: 'red' }}
                onClick={() => removeSubject(subjectIndex)}
                icon={
                  <CloseOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              />
            </Col>
          </Row>
        </React.Fragment>
      ))}
      <Row>
        <Col xs={24}>
          <Button
            onClick={() => appendSubject({ subjectName: '', description: '' })}
            style={{ marginTop: '10px', marginBottom: '20px' }}
          >
            Add Subject
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default UniversityForm;

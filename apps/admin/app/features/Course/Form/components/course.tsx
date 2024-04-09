'use client';
import React, { useEffect, useState, lazy, Suspense, ReactNode } from 'react';
import { Button, Col, Row, notification } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quillValidate } from 'apps/admin/helper/quillValidate';
import StudyLevelForm from './Level';
import {
  addCourse,
  fetchCoursesById,
  updateCourse,
} from 'apps/admin/app/api/Course';
import CourseSchema from '../validation';
import SCSelect from 'apps/admin/components/SCForm/SCSelect';
import { fetchStudyLevels } from 'apps/admin/app/api/studylevel';

interface ICourse {
  courseName: string;
  description: string;
  levels: {
    levelName: string;
    levelDescription: string;
    otherDescription: string;
  };
  subjects: {
    subjectName: string;
    description: string;
    otherDescription: string;
  }[];
}

const initialCourseState: ICourse = {
  courseName: '',
  description: '',
  levels: { levelName: '', levelDescription: '', otherDescription: '' },
  subjects: [{ subjectName: '', description: '', otherDescription: '' }],
};

// Lazy-loaded component imports
const JTLoader = lazy(() => import('../../../../../components/SCLoader'));

const SCTextArea = lazy(
  () => import('../../../../../components/SCForm/SCTextArea')
);
const SCInput = lazy(() => import('../../../../../components/SCForm/SCInput'));

interface StudyLevel {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface CourseFormProps {
  children: ReactNode;
}

function CourseForm({ children }: CourseFormProps) {
  const [loading, setLoading] = useState(false);
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(CourseSchema),
    defaultValues: initialCourseState,
  });

  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control,
    name: 'subjects',
  });

  const fetchAllCourseById = async () => {
    setLoading(true);
    try {
      const response = await fetchCoursesById({ id });
      console.log('Response:', response);

      reset({
        courseName: response.courseName,
        description: response.description,
        levels: {
          levelName: response.studyLevel?.name,
          levelDescription: response.studyLevel?.description,
          otherDescription: response.studyLevel?.otherDescription,
        },
        subjects:
          response.subject?.map(({ subject }: any) => ({
            subjectName: subject.subjectName || '',
            description: subject.description || '',
            otherDescription: '', // Set default value for otherDescription if needed
          })) || [],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourseById();
  }, [id, reset]);

  const fetchAllStudyLevel = async () => {
    setLoading(true);
    try {
      const [levelsData] = await Promise.all([fetchStudyLevels()]);
      setStudyLevels(levelsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudyLevel();
  }, []);

  const onSubmit = async (data: any) => {
    console.log(data, 'data');
    setLoading(true);
    if (id) {
      console.log(data, 'data');
      const updatedData: any = {
        ...data,
        id: id,
        subjects: data.subjects.map((subject: any) => ({
          subjectName: subject.subjectName,
          description: subject.description,
          otherDescription: subject.otherDescription,
        })),
      };

      console.log(updatedData, 'up');

      updateCourse(updatedData)
        .then((response) => {
          console.log(response, 'response');
          if (response.status === 200) {
            router.push('/course');
            notification.success({
              message: response.data.message,
            });
          } else {
            notification.warning({
              message: response.data.message,
            });
          }
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    } else {
      console.log(data, 'in comp');
      addCourse({ data })
        .then((response) => {
          if (response.status === 201) {
            router.push('/course');
            notification.success({
              message: response.data.message,
            });
          } else {
            notification.error({
              message: response.data.createBlog.error(),
            });
          }
        })
        .catch((error) => {
          notification.error({ message: error.message });
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // Handle form submission
  };

  return (
    <>
      <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <JTLoader visible={loading} />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 pb-8">
          <h3 className="text-xl font-bold mt-7  py-8 m-0">
            {id ? 'Edit' : 'Create'} Course
          </h3>
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={12}>
              <SCInput
                register={register}
                name="courseName"
                control={control}
                label="Course Name"
                parentClass="flex-grow mb-4"
                error={errors?.courseName?.message}
                placeholder="Course Name"
                size="large"
                required
              />
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={12}>
              <SCTextArea
                register={register}
                name="description"
                control={control}
                label="Course Description"
                parentClass="flex-grow mb-4"
                error={errors?.description?.message}
                placeholder="Course Description"
                size="large"
                required
              />
            </Col>
          </Row>
          <h3 className="text-xl font-bold mt-2  py-2 m-0">Add Level</h3>
          <Row gutter={[20, 20]}>
            <Col xs={12}>
              <SCInput
                register={register}
                name="levels.levelName"
                control={control}
                label="Level"
                parentClass="flex-grow mb-4"
                error={errors.levels?.levelName?.message}
                placeholder="Enter Level"
                required
              />
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={12}>
              <SCTextArea
                register={register}
                name="levels.levelDescription"
                control={control}
                label="Study Level Description"
                parentClass="flex-grow mb-4"
                error={errors.levels?.levelDescription?.message}
                placeholder="Study Level Description"
                size="large"
                required
              />
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={12}>
              <SCTextArea
                register={register}
                name="levels.otherDescription"
                control={control}
                label="Study Level other Description"
                parentClass="flex-grow mb-4"
                error={errors.levels?.otherDescription?.message}
                placeholder="Study Level other Description"
                size="large"
                required
              />
            </Col>
          </Row>

          <h3 className="text-xl font-bold mt-2  py-2 m-0">Add Subject</h3>
          {subjectFields.map((subject, index) => (
            <div key={subject.id}>
              <Row gutter={[20, 20]}>
                <Col xs={12}>
                  <SCInput
                    register={register}
                    name={`subjects[${index}].subjectName`}
                    control={control}
                    label="Subject Name"
                    error={errors?.subjects?.[index]?.subjectName?.message}
                    defaultValue={subject.id ? subject.subjectName : ''}
                    placeholder="Subject Name"
                    size="large"
                    required
                  />
                </Col>
              </Row>
              <Row gutter={[20, 20]}>
                <Col xs={24} xl={12}>
                  <SCTextArea
                    register={register}
                    name={`subjects[${index}].description`}
                    control={control}
                    label="Subject Description"
                    error={errors?.subjects?.[index]?.description?.message}
                    defaultValue={subject.id ? subject.description : ''}
                    placeholder="Subject Description"
                    size="large"
                    required
                  />
                </Col>
              </Row>
              <Row gutter={[20, 20]}>
                <Col xs={24} xl={12}>
                  <SCTextArea
                    register={register}
                    name={`subjects[${index}].otherDescription`}
                    control={control}
                    label="Other Description"
                    error={errors?.subjects?.[index]?.otherDescription?.message}
                    defaultValue={subject.id ? subject.otherDescription : ''}
                    placeholder="Other Description"
                    size="large"
                    required
                  />
                </Col>
              </Row>
              <Button type="dashed" onClick={() => removeSubject(index)}>
                Remove Subject
              </Button>
            </div>
          ))}

          <Button
            type="dashed"
            onClick={() =>
              appendSubject({
                subjectName: '',
                description: '',
                otherDescription: '',
              })
            }
          >
            Add Subject
          </Button>

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
                htmlType="submit"
                onClick={() => router.push('/blogs')}
                className="ml-4"
                size="large"
              >
                Cancel
              </Button>
            </div>
          </Row>
        </form>
      </div>
    </>
  );
}

export default CourseForm;

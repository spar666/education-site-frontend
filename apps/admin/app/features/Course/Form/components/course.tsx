'use client';
import React, { useEffect, useState, ReactNode } from 'react';
import { Button, Col, Row, notification, Select, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addCourse,
  fetchCoursesById,
  updateCourse,
  fetchCourseCategories,
} from 'apps/admin/app/api/Course';
import { fetchStudyLevels } from 'apps/admin/app/api/studylevel';
import CourseSchema from '../validation';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCTextArea from 'apps/admin/components/SCForm/SCTextArea';
import JTLoader from '../../../../../components/SCLoader';

interface ICourse {
  courseName: string;
  description: string;
  category: {
    courseCategory: string;
  };
  levels: {
    levelName: string;
    levelDescription: string;
    otherDescription: string;
  };
}

const initialCourseState: ICourse = {
  courseName: '',
  description: '',
  category: {
    courseCategory: '',
  },
  levels: { levelName: '', levelDescription: '', otherDescription: '' },
};

interface StudyLevel {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface CourseCategory {
  id?: string;
  courseCategory: string;
}

interface CourseFormProps {
  children: ReactNode;
}

const CourseForm: React.FC<CourseFormProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(CourseSchema),
    defaultValues: initialCourseState,
  });

  useEffect(() => {
    const fetchAllCourseById = async () => {
      setLoading(true);
      try {
        const [courseResponse, categoriesData] = await Promise.all([
          fetchCoursesById({ id }),
          fetchCourseCategories(),
        ]);
        console.log('Fetched Course Data:', courseResponse);
        console.log('Fetched Categories:', categoriesData);

        reset({
          courseName: courseResponse.courseName || '',
          description: courseResponse.description || '',
          category: {
            courseCategory: courseResponse.courseCategory.courseCategory,
          },
          levels: {
            levelName: courseResponse.studyLevel?.name || '',
            levelDescription: courseResponse.studyLevel?.description || '',
            otherDescription: courseResponse.studyLevel?.otherDescription || '',
          },
        });
        setCategories(categoriesData);
        setNewCategory(courseResponse.courseCategory.courseCategory); // Set the selected category
      } catch (error) {
        console.error('Error fetching:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllCourseById();
  }, [id, reset]);

  useEffect(() => {
    const fetchAllStudyLevel = async () => {
      setLoading(true);
      try {
        const levelsData = await fetchStudyLevels();
        console.log('Fetched Study Levels:', levelsData);
        setStudyLevels(levelsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({ message: 'Failed to fetch study levels' });
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudyLevel();
  }, []);

  const onSubmit = async (data: ICourse) => {
    setLoading(true);
    try {
      const updatedData = {
        ...data,
        id,
        category: newCategory ? { courseCategory: newCategory } : data.category,
      };

      console.log(updatedData, 'uddd');

      if (id) {
        const response = await updateCourse(updatedData);
        if (response.status === 200) {
          router.push('/course');
          notification.success({ message: response.data.message });
        } else {
          notification.warning({ message: response.data.message });
        }
      } else {
        const response = await addCourse({ data: updatedData });
        if (response.status === 201) {
          router.push('/course');
          notification.success({ message: response.data.message });
        } else {
          notification.error({ message: response.data.createBlog.error() });
        }
      }
    } catch (error) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <JTLoader visible={loading} />
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 pb-8">
        <h3 className="text-xl font-bold mt-7 py-8 m-0">
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
            <label htmlFor="category">Course Category</label>
            <Select
              style={{ width: '100%', marginBottom: '1rem' }}
              placeholder="Select a category"
              value={newCategory || initialCourseState.category.courseCategory}
              onChange={(value) => setNewCategory(value as string)} // Cast value to string
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}
                  >
                    <Input
                      style={{ flex: 'auto' }}
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add new category"
                    />
                    <Button
                      type="link"
                      onClick={() => {
                        setCategories([
                          ...categories,
                          { courseCategory: newCategory },
                        ]);
                        setNewCategory('');
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </>
              )}
            >
              {categories.map((category, index) => (
                <Select.Option
                  key={category.id || `new-${index}`} // Ensure unique keys
                  value={category.courseCategory}
                >
                  {category.courseCategory}
                </Select.Option>
              ))}
            </Select>
            {errors?.category && (
              <span className="error">{errors.category.message}</span>
            )}
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
        <h3 className="text-xl font-bold mt-2 py-2 m-0">Add Level</h3>
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
              label="Study Level Other Description"
              parentClass="flex-grow mb-4"
              error={errors.levels?.otherDescription?.message}
              placeholder="Study Level Other Description"
              size="large"
              required
            />
          </Col>
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
              htmlType="button" // Change from submit to button for cancel
              onClick={() => router.push('/course')}
              className="ml-4"
              size="large"
            >
              Cancel
            </Button>
          </div>
        </Row>
      </form>
    </div>
  );
};

export default CourseForm;

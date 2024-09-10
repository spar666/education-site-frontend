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
import CourseSchema from '../validation';
import SCInput from 'apps/admin/components/SCForm/SCInput';
import SCTextArea from 'apps/admin/components/SCForm/SCTextArea';
import JTLoader from '../../../../../components/SCLoader';
import SCSelect from 'apps/admin/components/SCForm/SCSelect';

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

interface CourseCategory {
  id?: string;
  courseCategory: string;
}

interface CourseFormProps {
  children: ReactNode;
}

const CourseForm: React.FC<CourseFormProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = await fetchCourseCategories();
        setCategories(categoriesData);

        if (id) {
          const courseResponse = await fetchCoursesById({ id });
          reset({
            courseName: courseResponse.courseName || '',
            description: courseResponse.description || '',
            category: {
              courseCategory: courseResponse.courseCategory.courseCategory,
            },
            levels: {
              levelName: courseResponse.studyLevel?.name || '',
              levelDescription: courseResponse.studyLevel?.description || '',
              otherDescription:
                courseResponse.studyLevel?.otherDescription || '',
            },
          });

          setNewCategory(courseResponse.courseCategory.courseCategory);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: ICourse) => {
    setLoading(true);
    try {
      const updatedData = {
        ...data,
        id,
        category: newCategory ? { courseCategory: newCategory } : data.category,
      };

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
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const staticStudyLevels = ['Undergraduates', 'Postgradutes', 'Doctoral'];

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
              onChange={(value) => setNewCategory(value as string)}
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
                  key={category.id || `new-${index}`}
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
            <SCSelect
              name="levels.levelName"
              control={control}
              options={staticStudyLevels.map((level) => ({
                value: level,
                label: level,
              }))}
              label="Select Level"
              error={errors.levels?.levelName?.message}
              parentClass="mb-4"
              required={true}
              register={register}
              placeholder="Select a level"
            />
            {errors.levels?.levelName && (
              <span className="error">{errors.levels.levelName.message}</span>
            )}
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
              error={errors?.description?.message}
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
              error={errors?.levels?.otherDescription?.message}
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
              Save Course
            </Button>
          </div>
        </Row>
      </form>
    </div>
  );
};

export default CourseForm;

import React, { useEffect, useState, ReactNode } from 'react';
import { Button, Col, Row, notification, Select, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { fetchStudyLevels } from 'apps/admin/app/api/studylevel';
import SCWysiwyg from 'apps/admin/components/SCForm/SCWysiwyg/index';

interface ICourse {
  courseName: string;
  category: {
    courseCategory: string;
  };
  levels: {
    levelName: string;
  };
}

interface IStudyLevel {
  name: string;
}

const initialCourseState: ICourse = {
  courseName: '',
  category: { courseCategory: '' },
  levels: { levelName: '' },
};

interface CourseCategory {
  id?: string;
  courseCategory: string;
}

interface CourseLevel {
  id?: string;
  levelName: string;
}

interface CourseFormProps {
  children: ReactNode;
}

const CourseForm: React.FC<CourseFormProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [studyLevels, setStudyLevels] = useState<CourseLevel[]>([]);
  const [newLevel, setNewLevel] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(CourseSchema),
    defaultValues: initialCourseState,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesData, levelData] = await Promise.all([
          fetchCourseCategories(),
          fetchStudyLevels(),
        ]);

        setCategories(categoriesData);
        setStudyLevels(
          levelData.map((level: IStudyLevel) => ({
            id: `${Date.now()}`,
            levelName: level.name,
          }))
        );

        if (id) {
          const courseResponse = await fetchCoursesById({ id });
          reset({
            courseName: courseResponse?.courseName || '',
            // description: courseResponse?.description || '',
            category: {
              courseCategory:
                courseResponse?.courseCategory?.courseCategory || '',
            },
            levels: courseResponse?.levels || initialCourseState.levels,
          });
          setNewCategory(courseResponse?.courseCategory?.courseCategory || '');
          setNewLevel(courseResponse?.studyLevel?.name || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({ message: 'Failed to fetch course data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    console.log('clicking');
    console.log(data, 'dattatat');
    setLoading(true);
    try {
      const updatedData = {
        ...data,
        id,
        category: newCategory ? { courseCategory: newCategory } : data.category,
        levels: newLevel ? { levelName: newLevel } : data.levels,
      };

      console.log(updatedData, 'updatedata');

      const response = id
        ? await updateCourse(updatedData)
        : await addCourse({ data: updatedData });

      if ([200, 201].includes(response.status)) {
        router.push('/course');
        notification.success({ message: response.data.message });
      } else {
        notification.warning({ message: response.data.message });
      }
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const addNewCategory = () => {
    if (newCategory.trim()) {
      setCategories((prev) => [
        ...prev,
        { id: `${Date.now()}`, courseCategory: newCategory },
      ]);
      setNewCategory('');
    }
  };

  const addNewLevel = () => {
    if (newLevel.trim()) {
      setStudyLevels((prev) => [
        ...prev,
        { id: `${Date.now()}`, levelName: newLevel },
      ]);
      setNewLevel(''); // Clear the input after adding
    }
  };

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto', maxWidth: '100%' }}>
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
              onChange={setNewCategory}
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
                    <Button type="link" onClick={addNewCategory}>
                      Add
                    </Button>
                  </div>
                </>
              )}
            >
              {categories.map((category) => (
                <Select.Option
                  key={category.id}
                  value={category.courseCategory}
                >
                  {category.courseCategory}
                </Select.Option>
              ))}
            </Select>
            {errors?.category && (
              <span className="error">
                {errors.category.message?.toString()}
              </span>
            )}
          </Col>
        </Row>

        {/* <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <SCWysiwyg
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
        </Row> */}

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <label htmlFor="studyLevl">Study Level</label>
            <Select
              style={{ width: '100%', marginBottom: '1rem' }}
              placeholder="Select a level"
              value={newLevel}
              onChange={setNewLevel}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'nowrap',
                      padding: 8,
                    }}
                  >
                    <Input
                      style={{ flex: 'auto' }}
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value)}
                      placeholder="Add new level"
                    />
                    <Button type="link" onClick={addNewLevel}>
                      Add
                    </Button>
                  </div>
                </>
              )}
            >
              {studyLevels.map((level) => (
                <Select.Option key={level.id} value={level.levelName}>
                  {level.levelName}
                </Select.Option>
              ))}
            </Select>
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
          </div>
        </Row>
      </form>
    </div>
  );
};

export default CourseForm;

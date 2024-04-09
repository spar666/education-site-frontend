import { object, string, array } from 'zod';

const CourseSchema = object({
  courseName: string()
    .min(3, { message: 'Course Name should be at least 3 characters' })
    .max(300, {
      message: 'Course Name should not exceed more than 300 characters',
    })
    .nonempty({ message: 'Course Name is required' })
    .trim(),
  description: string()
    .min(3, { message: 'Course Description should be at least 3 characters' })
    .max(300, {
      message: 'Course Description should not exceed more than 300 characters',
    })
    .trim()
    .optional()
    .nullable(),
  levels: object({
    levelName: string()
      .min(3, { message: 'Level Name should be at least 3 characters' })
      .max(300, { message: 'Level Name should not exceed 300 characters' }),
    levelDescription: string()
      .min(3, { message: 'Level Description should be at least 3 characters' })
      .max(300, { message: 'Level Description should not exceed 300 characters' }).nullable(),
    otherDescription: string().max(300, { message: 'Other Description should not exceed 300 characters' }).nullable(),
  }),
  subjects: array(object({
    subjectName: string(),
    description:  string().nullable(),
    
    
  })),
});

export default CourseSchema;

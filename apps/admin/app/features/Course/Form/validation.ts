import { object, string, array } from 'zod';

const CourseSchema = object({
  courseName: string()
    .min(3, { message: 'Course Name should be at least 3 characters' })
    .nonempty({ message: 'Course Name is required' })
    .trim(),
  description: string()
    .min(3, { message: 'Course Description should be at least 3 characters' })
    .trim()
    .optional()
    .nullable(),
   category: object({
    courseCategory: string()
      
  }),
  levels: object({
    levelName: string()
      .min(3, { message: 'Level Name should be at least 3 characters' }),
    levelDescription: string()
      .min(3, { message: 'Level Description should be at least 3 characters' }).nullable(),
    otherDescription: string().nullable(),
  }),
  // subjects: array(object({
  //   subjectName: string(),
  //   description:  string().nullable(),
    
    
  // })),
});

export default CourseSchema;

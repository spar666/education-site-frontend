import * as z from "zod";

const CourseSchema = z.object({
  courseName: z
    .string({ invalid_type_error: "Course Name is required" })
    .trim()
    .nonempty({ message: "Course Name is required" })
    .min(3, { message: "Course Name should be at least 3 character" })
    .max(300, {
      message: " Course Name should not exceed more than 300 character",
    }),
  description: z
    .string()
    .trim()
    .min(3, { message: "Course Description should be at least 3 character" })
    .max(300, {
      message: "Course Description should not exceed more than 300 character",
    })
    .optional()
    .nullable(),
  levelName: z.string().trim().nullable().optional(),
  levelDescription:z
    .string()
    .trim()
    .min(3, { message: "Level Description should be at least 3 character" })
    .max(300, {
      message: "Level Description should not exceed more than 300 character",
    })
    .optional()
    .nullable(),
  otherDescription: z
    .string()
    .trim()
    .min(3, { message: "Meta title should be at least 3 character" })
    .max(300, {
      message: "Meta title should not exceed more than 300 character",
    })
    .optional()
    .nullable(),
    subjectName:z
    .string({ invalid_type_error: "Subejct Name is required" })
    .trim()
    .nonempty({ message: "Subejct Name is required" })
    .min(3, { message: "Subejct Name should be at least 3 character" })
    .max(300, {
      message: " Subejct Name should not exceed more than 300 character",
    }),

    subejctDescription:z
    .string()
    .trim()
    .min(3, { message: "Subject Description should be at least 3 character" })
    .max(300, {
      message: "Subject Description should not exceed more than 300 character",
    })
    .optional()
    .nullable(),
  
});

export default CourseSchema;

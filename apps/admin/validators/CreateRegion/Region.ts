import * as z from "zod";

const RegionSchema = z.object({
  country: z
    .string()
    .trim()
    .nonempty({ message: "Country name is required" })
    .min(3, { message: "Country name should be at least 3 character" })
    .max(30, { message: "Country name should be atmost 30 character" }),

  title: z
    .string()
    .trim()
    .nonempty({ message: "Title is required" })
    .min(3, { message: "Title should be at least 3 character" })
    .max(300, {
      message: "Country name should not accept more than 300 character",
    }),
  slug: z
    .string({ invalid_type_error: "Title is required" })
    .trim()
    .regex(/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/, { message: "slug should be dash seperated" })
    .min(3, { message: "Slug should be at least 3 character" })
    .max(300, {
      message: " Slug should not exceed more than 300 character",
    })
    .or(z.literal(""))
    .optional()
    .nullable(),
  difficultLevel: z
    .string({ invalid_type_error: "Difficulty level is required" })
    .trim()
    .nonempty({ message: "Difficulty level  is required" }),
  description: z
    .string()
    .trim()
    .nonempty({ message: "Description is required" })
    .min(10, { message: "Description should be at least 10 character" }),
  coverPhoto: z.array(z.any()).nonempty({ message: "Cover Photo is required" }),
  gallery: z.array(z.any()).nonempty({ message: "Gallery is required" }),
  isActive: z.boolean(),
});

export default RegionSchema;

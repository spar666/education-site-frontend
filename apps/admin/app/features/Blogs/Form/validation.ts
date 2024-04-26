import * as z from "zod";

const BlogSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title is required" })
    .trim()
    .nonempty({ message: "Title is required" })
    .min(3, { message: "Title should be at least 3 character" }),
    
  metaTitle: z
    .string()
    .trim()
    .optional()
    .nullable(),
  metaDescription: z
    .string()
    .trim()
    .optional()
    .nullable(),
  schemaMarkup: z
    .string()
    .trim()
    .min(10, { message: "Schema Markup should be at least 10 character" })
    .or(z.literal(""))
    .optional()
    .nullable(),
  slug: z
    .string({ invalid_type_error: "Title is required" })
    .trim()
    .regex(/^[^\s-]+(-[^\s-]+)*$/, { message: "slug should be dash seperated" })
    .optional()
    .nullable(),
  tags: z.string().trim().array().nullable().optional(),
  contents: z
    .string({
      invalid_type_error: "Contents is required",
      required_error: "Contents is required",
    })
    .refine(
      (t) => {
        const forbiddenString = `<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`;

        return t !== forbiddenString;
      },
      { message: "Content is required" }
    ),
  coverImage: z.array(z.any()).nonempty({ message: "Cover Photo is required" }),
  images: z.array(z.any()).nullable().optional(),
  
});

export default BlogSchema;

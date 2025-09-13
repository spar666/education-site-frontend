import * as z from "zod";

const AboutUsSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .nonempty({ message: "Title is required" })
    ,

  contents: z
    .string({ error: "Contents is required" })
    .trim()
    .nonempty({ message: "Contents is required" }),

      coverImage: z.array(z.any()).nonempty({ message: "Cover Photo is required" }),
    
    
 
  
});

export default AboutUsSchema;

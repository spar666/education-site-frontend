import * as z from "zod";

const BannerSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title is required" })
    .trim()
    .nonempty({ message: "Title is required" })
    ,

  contents: z
    .string({ invalid_type_error: "Contents is required" })
    .trim()
    .nonempty({ message: "Contents is required" }),

      coverImage: z.array(z.any()).nonempty({ message: "Cover Photo is required" }),
    
    
 
  
});

export default BannerSchema;

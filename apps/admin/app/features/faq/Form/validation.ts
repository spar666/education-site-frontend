import * as z from "zod";

const FAQSchema = z.object({
  question: z
    .string({ invalid_type_error: "Question is required" })
    .trim()
    .nonempty({ message: "Question is required" })
    ,

  answer: z
    .string({ invalid_type_error: "Answer is required" })
    .trim()
    .nonempty({ message: "Answer is required" })
    
    
 
  
});

export default FAQSchema;

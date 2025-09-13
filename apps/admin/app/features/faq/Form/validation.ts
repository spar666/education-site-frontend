import * as z from "zod";

const FAQSchema = z.object({
  question: z
    .string({ error: "Question is required" })
    .trim()
    .nonempty({ message: "Question is required" })
    ,

  answer: z
    .string({ error: "Answer is required" })
    .trim()
    .nonempty({ message: "Answer is required" })
    
    
 
  
});

export default FAQSchema;

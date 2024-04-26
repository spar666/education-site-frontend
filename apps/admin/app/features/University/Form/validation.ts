import * as z from 'zod';

const UniversitySchema = z.object({
  universityName: z
    .string({ invalid_type_error: 'University Name is required' })
    .trim()
    .nonempty({ message: 'University Name is required' })
    .min(3, { message: 'University Name should be at least 3 characters' }),


  universityAddress: z
    .string({ invalid_type_error: 'University Address is required' })
    .trim()
    .nonempty({ message: 'University Address is required' })
    .min(3, { message: 'University Address should be at least 3 characters' }),
    

  universityContactNumber: z
    .string({ invalid_type_error: 'University Contact Number is required' })
    .trim()
    .nonempty({ message: 'University Contact Number is required' }),
    

  universityEmail: z
    .string({ invalid_type_error: 'University Email is required' })
    .trim()
    .nonempty({ message: 'University Email is required' }),
    

  worldRanking: z
    .number()
    .int()
    .positive({ message: 'World Ranking should be a positive integer' }),

  countryRanking: z
    .number()
    .int()
    .positive({ message: 'Country Ranking should be a positive integer' }),

  universityImage: z
    .array(z.any())
    .nonempty({ message: 'Cover Photo is required' }),

  description: z
    .string()
    .trim()
    .min(3, { message: 'Description should be at least 3 characters' })
   ,

  // financeDetails: z
  //   .object({
  //    tuitionFee:z.string().optional(),
  //    currency:z.string().optional(),
  //    financialAidAvailable:z.boolean(),
  //    scholarshipDetails:z.boolean()

  //   })
  //   .nullable(),
  // course: z.string().nullable(),
  // destination: z.string().nullable(),

  
});

export default UniversitySchema;

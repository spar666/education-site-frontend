import * as z from 'zod';

const ServiceTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: 'Service Type is required' })
    .min(3, { message: 'Service Type should be at least 3 letters long' }),
  isActive: z.boolean(),
});

export default ServiceTypeSchema;

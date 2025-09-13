import * as z from "zod";

const SafetyTrainingSchema = z.object({
  name: z
    .string({error:"Safety Training is required"})
    .trim()
    .nonempty({message: "Safety Training is required"})
    .min(3, { message: "Safety Training should be at least 3 letters long" })
    .max(30, { message: "Safety Training should be maximum of 30 letters" }),
  isActive: z.boolean(),
});

export default SafetyTrainingSchema;

import { object, string, enum as zEnum } from 'zod';

const UserSchema = object({
  firstName: string()
    .min(3, { message: 'First Name should be at least 3 characters' })
    .max(100, { message: 'First Name should not exceed 100 characters' })
    .nonempty({ message: 'First Name is required' })
    .trim(),
  lastName: string()
    .min(3, { message: 'Last Name should be at least 3 characters' })
    .max(100, { message: 'Last Name should not exceed 100 characters' })
    .nonempty({ message: 'Last Name is required' })
    .trim(),
  email: string()
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email should not exceed 255 characters' })
    .nonempty({ message: 'Email is required' })
    .trim(),
  phone: string()
    .min(10, { message: 'Phone number should be at least 10 characters' })
    .max(15, { message: 'Phone number should not exceed 15 characters' })
    .nonempty({ message: 'Phone number is required' })
    .regex(/^[0-9+\-() ]+$/, { message: 'Invalid phone number format' })
    .trim(),
  dateOfBirth: string()
    .nonempty({ message: 'Date of Birth is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date format (YYYY-MM-DD)' })
    .trim(),
  gender: string()
    .nonempty({ message: 'Gender is required' })
    .refine((val) => ['male', 'female', 'other'].includes(val.toLowerCase()), {
      message: 'Invalid gender value'
    }),
  role: zEnum(['admin', 'superadmin', 'manager'])
    .refine((value) => value !== undefined && value !== null, {
      message: 'Role is required'
    })
});

export default UserSchema;

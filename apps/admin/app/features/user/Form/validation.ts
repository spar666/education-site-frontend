import { object, string, array } from 'zod';

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
    .max(15, { message: 'Phone number should not exceed 15 characters' })
    .nonempty({ message: 'Phone number is required' })
    .trim(),
  dateOfBirth: string().nonempty({ message: 'Date of Birth is required' }).trim(),
  gender: string().nonempty({ message: 'Gender is required' }).trim(),
});

export default UserSchema;

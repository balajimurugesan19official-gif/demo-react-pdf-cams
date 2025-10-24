import { z } from 'zod';

export const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  accountNumber: z.string().regex(/^\d{10}$/, 'Account number must be 10 digits'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  branchCode: z.string().optional(),
  phoneNumber: z.string().regex(/^\+?\d{1,3}-?\d{3}-?\d{3}-?\d{4}$/, 'Invalid phone number format'),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to terms'),
});

export type FormSchema = z.infer<typeof formSchema>;

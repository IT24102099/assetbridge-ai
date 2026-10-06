import { z } from 'zod';

export const createProviderSchema = z.object({
  code: z.string().min(2, 'Code is required'),
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  address: z.string().min(2, 'Address is required'),
  location: z.string().min(2, 'Location is required'),
  registrationNumber: z.string().min(2, 'Registration number is required'),
  skills: z.array(z.string()).default([]),
  serviceAreas: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).default(5.0),
  reviewCount: z.number().int().min(0).default(0),
  jobsCount: z.number().int().min(0).default(0),
  verificationStatus: z.enum(['VERIFIED', 'PENDING', 'UNVERIFIED']).default('PENDING'),
  insuranceStatus: z.enum(['VERIFIED', 'PENDING', 'UNVERIFIED']).default('PENDING'),
  description: z.string().default(''),
});

export const updateProviderSchema = createProviderSchema.partial();

export const providerQuerySchema = z.object({
  search: z.string().optional(),
  skill: z.string().optional(),
  status: z.enum(['VERIFIED', 'PENDING', 'UNVERIFIED']).optional(),
  location: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const providerSearchCriteriaSchema = z.object({
  skill: z.string().optional(),
  location: z.string().optional(),
  maxDistance: z.coerce.number().min(0).optional(),
  availableDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'availableDate must be YYYY-MM-DD').optional(),
});

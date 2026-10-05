import { z } from 'zod';

export const createRepresentativeSchema = z.object({
  code: z.string().min(2, 'Code is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  location: z.string().min(2, 'Location is required'),
  address: z.string().min(2, 'Address is required'),
  nic: z.string().min(2, 'NIC is required'),
  skills: z.array(z.string()).default([]),
  preferredAreas: z.array(z.string()).default([]),
  assignedAssets: z.array(z.string()).default([]),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  verificationStatus: z.enum(['VERIFIED', 'PENDING', 'UNVERIFIED']).default('PENDING'),
  joinedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Joined date must be YYYY-MM-DD'),
  notes: z.string().optional(),
});

export const updateRepresentativeSchema = createRepresentativeSchema.partial();

export const representativeQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
  location: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

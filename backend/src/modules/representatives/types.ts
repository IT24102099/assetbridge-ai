export type RepresentativeStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';

export interface Representative {
  id: string;
  code: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  nic: string;
  skills: string[];
  preferredAreas: string[];
  assignedAssets: string[];
  status: RepresentativeStatus;
  verificationStatus: VerificationStatus;
  joinedDate: string;
  notes?: string;
}

export interface RepresentativeQueryParams {
  search?: string;
  status?: RepresentativeStatus;
  location?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

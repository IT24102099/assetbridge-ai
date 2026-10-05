export type ProviderStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';

export interface ServiceProvider {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  registrationNumber: string;
  skills: string[];
  serviceAreas: string[];
  rating: number;
  reviewCount: number;
  jobsCount: number;
  verificationStatus: ProviderStatus;
  insuranceStatus: ProviderStatus;
  description: string;
}

export interface ProviderQueryParams {
  search?: string;
  skill?: string;
  status?: ProviderStatus;
  location?: string;
  page?: number;
  limit?: number;
}

export interface ProviderSearchCriteria {
  skill?: string;
  location?: string;
  maxDistance?: number;
  availableDate?: string;
}

export interface ProviderMatchResult {
  provider: ServiceProvider;
  location: string;
  distance: number; // in kilometers or miles
  rating: number;
  verificationStatus: ProviderStatus;
  jobsCount: number;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
}

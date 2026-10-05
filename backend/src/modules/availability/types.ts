export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';

export interface ProviderAvailability {
  id: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  status: AvailabilityStatus;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  notes?: string;
}

export interface AvailabilityQueryParams {
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  date?: string;
}

export type RepresentativeStatus = 'active' | 'inactive' | 'on-leave'

export interface Representative {
  id: string
  code: string
  name: string
  email: string
  phone: string
  role: string
  region: string
  status: RepresentativeStatus
  assignedProvidersCount: number
  activeTasks: number
  rating: number
  avatar: string
  bio: string
  specialization: string
  dateJoined: string
}

export type ProviderCategory =
  | 'Maintenance'
  | 'Inspection'
  | 'Valuation'
  | 'Legal'
  | 'Logistics'
  | 'Insurance'

export type ProviderStatus = 'verified' | 'pending' | 'suspended'

export interface ServiceProvider {
  id: string
  code: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  category: ProviderCategory
  region: string
  serviceArea: string
  rating: number
  hourlyRate: number
  status: ProviderStatus
  completedJobs: number
  responseTimeHours: number
  satisfactionRate: number
  certifications: string[]
  assignedRepresentativeId: string
  representativeName: string
  avatar: string
  bio: string
  address: string
}

export type SlotStatus = 'available' | 'booked' | 'unavailable'

export interface AvailabilitySlot {
  id: string
  providerId: string
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  status: SlotStatus
  taskTitle?: string
  representativeName?: string
  notes?: string
}

export interface ProviderMatchCriteria {
  category: string
  region: string
  minRating: number
  maxHourlyRate: number
  requiredCertification: string
  availabilityDate: string
}

export interface ProviderMatchResult {
  provider: ServiceProvider
  matchScore: number
  matchReasons: string[]
  categoryMatch: boolean
  regionMatch: boolean
  ratingMatch: boolean
  priceMatch: boolean
  availabilityMatch: boolean
}

export interface InspectionItem {
  id: string
  incidentId: string
  assetId: string
  assetName: string
  inspectorName: string
  problemCategory: string
  finding: string
  requiredWork: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
  damageLevel: 'Minor' | 'Moderate' | 'Severe' | 'Critical'
  recommendations: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Under Review'
  inspectedAt: string
  locationGps: string
  photos: string[]
  estimatedDamageCost: number
}

export interface QuotationLineItem {
  itemName: string
  category: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface QuotationItem {
  id: string
  incidentId: string
  inspectionId: string
  assetId: string
  assetName: string
  providerId: string
  providerName: string
  providerRating: number
  previousJobsCompleted: number
  distanceKm: number
  isVerified: boolean
  amountLkr: number
  executionTimeDays: number
  availableStartDate: string
  warrantyMonths: number
  warrantyDescription: string
  status: 'Submitted' | 'Under Review' | 'AI Recommended' | 'Approved' | 'Rejected'
  isAiRecommended: boolean
  recommendationScore: number
  recommendationSummary: string
  recommendationReasons: string[]
  submittedAt: string
  lineItems: QuotationLineItem[]
}

export interface JobProgressStep {
  stepName: string
  description: string
  timestamp: string | null
  isCompleted: boolean
  isCurrent: boolean
}

export interface MaintenanceJobItem {
  id: string
  incidentId: string
  inspectionId: string
  quotationId: string
  assetId: string
  assetName: string
  assetAddress: string
  maintenanceType: string
  title: string
  description: string
  providerName: string
  providerPhone: string
  approvedCostLkr: number
  scheduledDate: string
  completedDate?: string
  status: 'Assigned' | 'Provider Accepted' | 'On the Way' | 'Work In Progress' | 'Completed'
  progressPercentage: number
  progressSteps: JobProgressStep[]
  beforePhotos: string[]
  completionPhotos: string[]
  completionNotes: string
  pressureTestReading?: string
  warrantyCertificateId?: string
}

export interface CatalogItem {
  id: string
  itemName: string
  category: string
  unit: string
  unitPriceLkr: number
  status: 'Available' | 'Low Stock' | 'Discontinued'
  description: string
}

export interface MaintenanceHistoryItem {
  id: string
  assetId: string
  assetName: string
  jobId: string
  maintenanceType: string
  description: string
  costLkr: number
  providerName: string
  completedDate: string
  warrantyUntil?: string
  status: string
}

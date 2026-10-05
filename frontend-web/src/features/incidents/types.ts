export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical'

export type IncidentStatus =
  | 'Reported'
  | 'UnderReview'
  | 'InProgress'
  | 'Resolved'
  | 'Closed'

export interface IncidentEvidence {
  id: number
  incidentId: number
  fileUrl: string
  fieldType?: string
  fileType: string
  uploadedAt: string
}

export interface Incident {
  id: number
  assetId: number
  assetCode?: string
  assetName?: string
  assetLocation?: string
  title: string
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  budget?: number
  preferredDate?: string
  photoUrl?: string
  createdAt: string
  updatedAt?: string
  evidences: IncidentEvidence[]
}

export interface CreateIncidentInput {
  assetId: number
  title: string
  description: string
  severity: IncidentSeverity
  budget?: number
  preferredDate?: string
  photoUrl?: string
  reportedBy?: string
}

export interface UpdateIncidentStatusInput {
  status: IncidentStatus
  notes?: string
  updatedBy?: string
}

import {
  InspectionItem,
  QuotationItem,
  MaintenanceJobItem,
  CatalogItem,
} from './types'
import {
  INITIAL_INSPECTIONS,
  INITIAL_QUOTATIONS,
  INITIAL_MAINTENANCE_JOBS,
  CATALOG_ITEMS,
} from './data/mock-data'

const API_BASE_URL = 'http://localhost:5000/api'

// In-memory state store for responsive client-side interactions
let localInspections = [...INITIAL_INSPECTIONS]
let localQuotations = [...INITIAL_QUOTATIONS]
let localJobs = [...INITIAL_MAINTENANCE_JOBS]
let localCatalog = [...CATALOG_ITEMS]

export const maintenanceApi = {
  // Inspections
  async getInspections(): Promise<InspectionItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/Inspection`)
      if (res.ok) return await res.json()
    } catch {
      // Fallback to local
    }
    return localInspections
  },

  async getInspectionById(id: string): Promise<InspectionItem | undefined> {
    try {
      const res = await fetch(`${API_BASE_URL}/Inspection/${id}`)
      if (res.ok) return await res.json()
    } catch {
      // Fallback
    }
    return localInspections.find((i) => i.id === id)
  },

  async createInspection(data: Partial<InspectionItem>): Promise<InspectionItem> {
    const newItem: InspectionItem = {
      id: `INS-${Math.floor(1040 + Math.random() * 9000)}`,
      incidentId: data.incidentId || 'INC-1021',
      assetId: data.assetId || 'AS-KDY-001',
      assetName: data.assetName || 'Kandy House',
      inspectorName: data.inspectorName || 'Nimal Perera (Representative)',
      problemCategory: data.problemCategory || 'Water Leakage',
      finding: data.finding || '',
      requiredWork: data.requiredWork || '',
      priority: data.priority || 'HIGH',
      damageLevel: data.damageLevel || 'Moderate',
      recommendations: data.recommendations || '',
      status: 'Completed',
      inspectedAt: new Date().toISOString(),
      locationGps: data.locationGps || '7.2906° N, 80.6337° E',
      photos: data.photos || [],
      estimatedDamageCost: data.estimatedDamageCost || 40000,
    }

    try {
      const res = await fetch(`${API_BASE_URL}/Inspection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })
      if (res.ok) return await res.json()
    } catch {
      // fallback
    }

    localInspections = [newItem, ...localInspections]
    return newItem
  },

  // Quotations
  async getQuotations(incidentId?: string): Promise<QuotationItem[]> {
    try {
      const url = incidentId
        ? `${API_BASE_URL}/Quotation?incidentId=${incidentId}`
        : `${API_BASE_URL}/Quotation`
      const res = await fetch(url)
      if (res.ok) return await res.json()
    } catch {
      // Fallback
    }
    return incidentId
      ? localQuotations.filter((q) => q.incidentId === incidentId)
      : localQuotations
  },

  async createQuotation(data: Partial<QuotationItem>): Promise<QuotationItem> {
    const newQuote: QuotationItem = {
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      incidentId: data.incidentId || 'INC-1021',
      inspectionId: data.inspectionId || 'INS-1021',
      assetId: data.assetId || 'AS-KDY-001',
      assetName: data.assetName || 'Kandy House',
      providerId: `PRV-${Math.floor(10 + Math.random() * 90)}`,
      providerName: data.providerName || 'New Provider',
      providerRating: data.providerRating || 4.6,
      previousJobsCompleted: data.previousJobsCompleted || 12,
      distanceKm: data.distanceKm || 5.0,
      isVerified: true,
      amountLkr: data.amountLkr || 40000,
      executionTimeDays: data.executionTimeDays || 2,
      availableStartDate: data.availableStartDate || 'Tomorrow',
      warrantyMonths: data.warrantyMonths || 12,
      warrantyDescription: `${data.warrantyMonths || 12} months warranty`,
      status: 'Submitted',
      isAiRecommended: false,
      recommendationScore: 80,
      recommendationSummary: 'Competitive bid submitted for review.',
      recommendationReasons: ['Within owner budget'],
      submittedAt: new Date().toISOString(),
      lineItems: data.lineItems || [],
    }

    try {
      const res = await fetch(`${API_BASE_URL}/Quotation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuote),
      })
      if (res.ok) return await res.json()
    } catch {
      // Fallback
    }

    localQuotations = [...localQuotations, newQuote]
    return newQuote
  },

  // Maintenance Jobs
  async getJobs(status?: string): Promise<MaintenanceJobItem[]> {
    try {
      const url = status
        ? `${API_BASE_URL}/Maintenance?status=${status}`
        : `${API_BASE_URL}/Maintenance`
      const res = await fetch(url)
      if (res.ok) return await res.json()
    } catch {
      // Fallback
    }
    return status ? localJobs.filter((j) => j.status === status) : localJobs
  },

  async updateJobProgress(
    id: string,
    status: MaintenanceJobItem['status'],
    note?: string
  ): Promise<MaintenanceJobItem | undefined> {
    try {
      const res = await fetch(`${API_BASE_URL}/Maintenance/${id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      })
      if (res.ok) return await res.json()
    } catch {
      // Fallback
    }

    const job = localJobs.find((j) => j.id === id)
    if (job) {
      job.status = status
      job.progressPercentage =
        status === 'Assigned'
          ? 20
          : status === 'Provider Accepted'
            ? 40
            : status === 'On the Way'
              ? 60
              : status === 'Work In Progress'
                ? 80
                : 100

      const step = job.progressSteps.find((s) => s.stepName === status)
      if (step) {
        step.isCompleted = true
        step.isCurrent = true
        step.timestamp = new Date().toISOString()
        if (note) step.description = note
      }
    }
    return job
  },

  async completeJob(
    id: string,
    photos: string[],
    notes: string,
    pressureReading: string
  ): Promise<MaintenanceJobItem | undefined> {
    try {
      const res = await fetch(`${API_BASE_URL}/Maintenance/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completionPhotos: photos,
          completionNotes: notes,
          pressureTestReading: pressureReading,
        }),
      })
      if (res.ok) return await res.json()
    } catch {
      // Fallback
    }

    const job = localJobs.find((j) => j.id === id)
    if (job) {
      job.status = 'Completed'
      job.progressPercentage = 100
      job.completedDate = new Date().toISOString()
      job.completionPhotos = [...job.completionPhotos, ...photos]
      job.completionNotes = notes
      job.pressureTestReading = pressureReading
    }
    return job
  },

  // Catalog
  async getCatalog(category?: string): Promise<CatalogItem[]> {
    try {
      const url = category
        ? `${API_BASE_URL}/Catalog?category=${category}`
        : `${API_BASE_URL}/Catalog`
      const res = await fetch(url)
      if (res.ok) return await res.json()
    } catch {
      // Fallback
    }
    return category
      ? localCatalog.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        )
      : localCatalog
  },

  // RAG Search
  async searchRag(query: string) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/Agent3/rag-search?query=${encodeURIComponent(query)}`
      )
      if (res.ok) return await res.json()
    } catch {
      // Fallback
    }

    return [
      {
        documentName: 'Water_Leakage_Maintenance_Guide.md',
        category: 'Plumbing Guidelines',
        matchedSnippet:
          'Shut off main water supply immediately. Replace damaged PPR pipe section. Apply waterproof polymer plaster and pressure test at 6 bar for 30 minutes.',
        relevanceScore: 0.94,
        extractedSafetyPoints: [
          'Shut off main water supply stopcock immediately',
          'Isolate electrical circuit breakers feeding damp walls',
          'Hydrostatic testing at 6.0 bar minimum for 30 minutes',
        ],
      },
      {
        documentName: 'Electrical_Safety_Guide.md',
        category: 'Life Safety Standards',
        matchedSnippet:
          'Water near electrical equipment requires immediate circuit breaker trip. Requires dual certified trades: Plumbing + Electrical.',
        relevanceScore: 0.88,
        extractedSafetyPoints: [
          'Isolate electrical power supply prior to opening masonry',
          'Avoid touching pooled water or wet wall structures',
        ],
      },
    ]
  },
}

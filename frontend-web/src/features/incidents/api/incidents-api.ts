import { apiClient } from '@/lib/api-client'
import {
  Incident,
  CreateIncidentInput,
  UpdateIncidentStatusInput,
  IncidentEvidence,
} from '../types'

const initialMockIncidents: Incident[] = [
  {
    id: 1001,
    assetId: 2,
    assetCode: 'AST-KND-002',
    assetName: 'Kandy General Hospital Backup Generator',
    assetLocation: 'Main Power House, Kandy Teaching Hospital',
    title: 'Engine Coolant Leak & Overheating Alert',
    description:
      'Coolant temperature exceeded 95°C during the weekly routine test cycle. Suspected radiator gasket failure or radiator hose puncture requiring immediate emergency repair before scheduled hospital power maintenance.',
    severity: 'High',
    status: 'InProgress',
    budget: 85000,
    preferredDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    photoUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    evidences: [
      {
        id: 1,
        incidentId: 1001,
        fileUrl:
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        fileType: 'image/jpeg',
        uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 1002,
    assetId: 1,
    assetCode: 'AST-CMB-001',
    assetName: 'Colombo Central Water Pump #4',
    assetLocation: 'Maligawatta Pumping Station, Colombo 10',
    title: 'Low Discharge Pressure & Valve Cavitation Noise',
    description:
      'Pressure gauge indicates 2.4 bar instead of the standard 4.5 bar operating threshold. Rattling noise observed in suction pipeline. Field technician suspects intake debris blockage or impeller wear.',
    severity: 'Medium',
    status: 'UnderReview',
    budget: 45000,
    preferredDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    photoUrl:
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    evidences: [
      {
        id: 2,
        incidentId: 1002,
        fileUrl:
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        fileType: 'image/jpeg',
        uploadedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 1003,
    assetId: 4,
    assetCode: 'AST-GLE-004',
    assetName: 'Galle Fort Coastal Drainage Gate #2',
    assetLocation: 'Rampart Street Gate, Galle Fort',
    title: 'Hydraulic Gate Arm Jammed Due to Marine Debris',
    description:
      'Heavy seasonal tide washed plastic logs and debris into the drainage culvert, preventing automated gate closure. Critical during high tide to avoid seawater backflow into heritage residential sectors.',
    severity: 'Critical',
    status: 'Reported',
    budget: 120000,
    preferredDate: new Date().toISOString(),
    photoUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    evidences: [
      {
        id: 3,
        incidentId: 1003,
        fileUrl:
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
        fileType: 'image/jpeg',
        uploadedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: 1004,
    assetId: 3,
    assetCode: 'AST-JFN-003',
    assetName: 'Jaffna Agro Solar Grid Inverter Unit',
    assetLocation: 'Thirunelvely Agri-Research Zone, Jaffna',
    title: 'Minor Inverter Heat Sink Dust Accumulation',
    description:
      'Dust build-up noted during quarterly drone thermal inspection. Cleaned filters and reset inverter thermals.',
    severity: 'Low',
    status: 'Resolved',
    budget: 15000,
    preferredDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    evidences: [],
  },
]

let memoryIncidents = [...initialMockIncidents]

export const incidentsApi = {
  async getAll(params?: {
    assetId?: number
    status?: string
    severity?: string
    search?: string
  }): Promise<Incident[]> {
    try {
      const response = await apiClient.get<Incident[]>('/incidents', { params })
      return response.data
    } catch {
      let filtered = [...memoryIncidents]
      if (params?.assetId) {
        filtered = filtered.filter((i) => i.assetId === params.assetId)
      }
      if (params?.status && params.status !== 'all') {
        filtered = filtered.filter((i) => i.status === params.status)
      }
      if (params?.severity && params.severity !== 'all') {
        filtered = filtered.filter((i) => i.severity === params.severity)
      }
      if (params?.search) {
        const s = params.search.toLowerCase()
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(s) ||
            i.description.toLowerCase().includes(s) ||
            (i.assetName && i.assetName.toLowerCase().includes(s)) ||
            (i.assetCode && i.assetCode.toLowerCase().includes(s))
        )
      }
      return filtered
    }
  },

  async getById(id: number): Promise<Incident | null> {
    try {
      const response = await apiClient.get<Incident>(`/incidents/${id}`)
      return response.data
    } catch {
      const inc = memoryIncidents.find((i) => i.id === id)
      return inc || null
    }
  },

  async create(input: CreateIncidentInput): Promise<Incident> {
    try {
      const response = await apiClient.post<Incident>('/incidents', input)
      return response.data
    } catch {
      const newIncident: Incident = {
        id: Date.now(),
        assetId: input.assetId,
        assetCode: `AST-${input.assetId}`,
        assetName: 'Linked Infrastructure Asset',
        title: input.title,
        description: input.description,
        severity: input.severity,
        status: 'Reported',
        budget: input.budget,
        preferredDate: input.preferredDate,
        photoUrl: input.photoUrl,
        createdAt: new Date().toISOString(),
        evidences: input.photoUrl
          ? [
              {
                id: Date.now() + 1,
                incidentId: Date.now(),
                fileUrl: input.photoUrl,
                fileType: 'image/jpeg',
                uploadedAt: new Date().toISOString(),
              },
            ]
          : [],
      }
      memoryIncidents.unshift(newIncident)
      return newIncident
    }
  },

  async updateStatus(
    id: number,
    input: UpdateIncidentStatusInput
  ): Promise<Incident> {
    try {
      const response = await apiClient.patch<Incident>(
        `/incidents/${id}/status`,
        input
      )
      return response.data
    } catch {
      const index = memoryIncidents.findIndex((i) => i.id === id)
      if (index === -1) throw new Error('Incident not found')
      const updated: Incident = {
        ...memoryIncidents[index],
        status: input.status,
        updatedAt: new Date().toISOString(),
      }
      memoryIncidents[index] = updated
      return updated
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/incidents/${id}`)
    } catch {
      memoryIncidents = memoryIncidents.filter((i) => i.id !== id)
    }
  },

  async addEvidence(
    incidentId: number,
    fileUrl: string,
    fileType: string
  ): Promise<IncidentEvidence> {
    try {
      const response = await apiClient.post<IncidentEvidence>(
        `/incidents/${incidentId}/evidence`,
        { fileUrl, fileType }
      )
      return response.data
    } catch {
      const ev: IncidentEvidence = {
        id: Date.now(),
        incidentId,
        fileUrl,
        fileType,
        uploadedAt: new Date().toISOString(),
      }
      const inc = memoryIncidents.find((i) => i.id === incidentId)
      if (inc) {
        inc.evidences.push(ev)
      }
      return ev
    }
  },

  async planIncident(incidentId: number) {
    try {
      const response = await apiClient.post(`/agent/incident-planning/${incidentId}`)
      return response.data
    } catch {
      const inc = memoryIncidents.find((i) => i.id === incidentId) || memoryIncidents[0]
      return {
        objective: `Orchestrate end-to-end resolution for incident #${inc.id} ('${inc.title}') at ${inc.assetName || "Facility"}. Triage defect scope, match vetted contractors, enforce owner sign-off, and verify repair.`,
        priority: inc.severity.toUpperCase(),
        incidentId: inc.id,
        assetCode: inc.assetCode || 'AST-001',
        assetName: inc.assetName || 'Municipal Facility',
        location: inc.assetLocation || 'Colombo, Sri Lanka',
        identifiedDefect: inc.title,
        requiredSpecialization: inc.title.toLowerCase().includes('coolant') || inc.title.toLowerCase().includes('generator')
          ? 'Certified Heavy Electrical & Generator Technician'
          : 'Licensed Commercial & Municipal Plumber',
        estimatedBudget: inc.budget || 65000,
        targetDeadline: inc.preferredDate,
        riskAnalysis: {
          riskLevel: inc.severity === 'Critical' || inc.severity === 'High' ? 'High / Critical Risk' : 'Moderate Risk',
          safetyHazards: [
            'Immediate risk of equipment overheating and permanent rotor seizure.',
            'Secondary electrical short circuit hazard during emergency grid handoff.',
            'Facility downtime affecting public service delivery.'
          ],
          operationalImpact: 'Immediate inspection required to avoid emergency blackout or localized structural damage.',
          continuityThreat: inc.severity === 'Critical' || inc.severity === 'High'
        },
        ragKnowledge: {
          retrievedDocuments: [
            {
              id: 'DOC-PLUMB-01',
              title: 'Residential & Municipal Water Leakage Response Manual (SLS 147)',
              category: 'Plumbing & Hydraulics',
              content: 'Comprehensive emergency guidelines for pressurized water pipes, booster pumps, and valve failures.',
              recommendedTrade: 'Licensed Commercial & Municipal Plumber'
            },
            {
              id: 'DOC-ELEC-02',
              title: 'Standby Diesel Generator & Critical Power Electrical Safety Guidelines',
              category: 'Electrical & Power Generation',
              content: 'Standard operating procedures for generator coolant leaks, radiator overheating, emergency stop sequences, and electrical lockout/tagout (LOTO).',
              recommendedTrade: 'Certified Heavy Electrical & Generator Technician'
            }
          ],
          immediateSafetyActions: [
            'Isolate primary intake supply / emergency stop switch immediately.',
            'Relieve residual line pressure through downstream taps before technician arrival.',
            'Deploy dry chemical extinguishers nearby and clear unauthorized personnel.'
          ],
          standardOperatingProcedures: [
            'Adhere to SLS 147 municipal standards for pressure tolerance verification.',
            'Follow Ceylon Electricity Board (CEB) lockout/tagout transfer protocols.'
          ]
        },
        toolCallsExecuted: [
          { toolName: 'GetIncident', arguments: { incidentId }, success: true, timestamp: new Date().toISOString() },
          { toolName: 'GetAsset', arguments: { assetId: inc.assetId }, success: true, timestamp: new Date().toISOString() },
          { toolName: 'GetAssetHistory', arguments: { assetId: inc.assetId }, success: true, timestamp: new Date().toISOString() },
          { toolName: 'GetIncidentEvidence', arguments: { incidentId }, success: true, timestamp: new Date().toISOString() },
          { toolName: 'CreateWorkflowPlan', arguments: { incidentId, trade: 'Specialist' }, success: true, timestamp: new Date().toISOString() }
        ],
        executionPlan: [
          {
            stepNumber: 1,
            name: 'Asset Diagnostics & Triage Verification',
            assignedComponent: 'Member 1: Asset & Incident Management',
            action: 'Verify Asset State & Incident Scope',
            description: `Triage defect '${inc.title}' on ${inc.assetCode} against RAG standards.`,
            expectedOutput: 'Verified defect parameters and formal triage classification.',
            status: 'Completed',
            estimatedDuration: '15 minutes'
          },
          {
            stepNumber: 2,
            name: 'Local Representative & Provider Matching',
            assignedComponent: 'Member 2: Provider Representative Coordination',
            action: 'Engage Local Rep & Search Provider Network',
            description: `Dispatch local representative and match 2-3 vetted specialists in ${inc.assetLocation || "Western Province"}.`,
            expectedOutput: 'Shortlist of vetted contractors with rating > 4.5.',
            status: 'Active',
            estimatedDuration: '1 - 2 hours'
          },
          {
            stepNumber: 3,
            name: 'Inspection Scheduling & Quotation Submission',
            assignedComponent: 'Member 3: Maintenance & Quotation Management',
            action: 'On-site Inspection & Itemized Quotation',
            description: 'Contractor conducts physical damage check and submits itemized quotes (labor, parts, materials).',
            expectedOutput: 'Itemized quotation breakdown within allocated budget.',
            status: 'Pending',
            estimatedDuration: '4 hours'
          },
          {
            stepNumber: 4,
            name: 'AI Quote Comparison & Cost Recommendation',
            assignedComponent: 'Member 3: Maintenance & Cost Recommendation Agent',
            action: 'RAG Cost Benchmarking',
            description: 'Evaluate submitted quote against Sri Lankan market rates and historical maintenance logs.',
            expectedOutput: 'Recommended best-value contractor with risk score.',
            status: 'Pending',
            estimatedDuration: '15 minutes'
          },
          {
            stepNumber: 5,
            name: 'Human-in-the-Loop Owner Approval Gateway',
            assignedComponent: 'Member 4: Approval & Workflow Continuity',
            action: 'Request Owner Authorization',
            description: 'Present AI-validated repair plan and quotation to the overseas asset owner for explicit approval.',
            expectedOutput: 'Owner approval confirmation and escrow fund release.',
            status: 'Pending',
            estimatedDuration: 'Within 24 hours'
          },
          {
            stepNumber: 6,
            name: 'Work Execution & Post-Repair Validation',
            assignedComponent: 'Member 4: Validation & Continuity Agent',
            action: 'Oversee Repairs & Verify Quality',
            description: 'Contractor completes repair; Local Rep uploads after-repair photos; Validation Agent audits and restores asset.',
            expectedOutput: 'Before/after photo audit log and asset restored to Active.',
            status: 'Pending',
            estimatedDuration: '6 - 12 hours'
          }
        ],
        nextRecommendedAction: 'Isolate primary supply switch immediately and notify Local Representative for emergency dispatch.',
        generatedAt: new Date().toISOString()
      }
    }
  },
}

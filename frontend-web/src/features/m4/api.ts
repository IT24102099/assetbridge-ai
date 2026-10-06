import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import type {
  Approval,
  ApprovalStatus,
  AuditLog,
  FollowUp,
  FollowUpStatus,
  WorkflowTimeline,
} from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function getApprovals(params?: {
  status?: ApprovalStatus
  priority?: string
  search?: string
}) {
  const { data } = await api.get<Approval[]>('/approvals', { params })
  return data
}

export async function getApproval(id: string) {
  const { data } = await api.get<Approval>(`/approvals/${id}`)
  return data
}

export async function getWorkflowTimeline(id: string) {
  const { data } = await api.get<WorkflowTimeline>(`/workflows/${id}/timeline`)
  return data
}

export async function actOnApproval(
  id: string,
  action: 'approve' | 'reject' | 'request-revision',
  comment?: string
) {
  const { data } = await api.post<Approval>(`/approvals/${id}/${action}`, {
    comment,
  })
  return data
}

export async function getAuditLogs(params?: { search?: string; source?: string }) {
  const { data } = await api.get<AuditLog[]>('/audit-logs', { params })
  return data
}

export async function getFollowUps(params?: { status?: FollowUpStatus }) {
  const { data } = await api.get<FollowUp[]>('/follow-ups', { params })
  return data
}

export async function createFollowUp(input: Omit<FollowUp, 'id' | 'status'>) {
  const { data } = await api.post<FollowUp>('/follow-ups', input)
  return data
}

export async function updateFollowUp(id: string, status: FollowUpStatus) {
  const { data } = await api.patch<FollowUp>(`/follow-ups/${id}`, { status })
  return data
}

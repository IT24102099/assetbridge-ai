export const approvalStatuses = [
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'Revision Requested',
  'In Progress',
  'Completed',
  'Cancelled',
] as const

export type ApprovalStatus = (typeof approvalStatuses)[number]
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export type Approval = {
  id: string
  title: string
  assetName: string
  assetId: string
  requesterName: string
  requesterEmail?: string
  status: ApprovalStatus
  priority: Priority
  aiRecommendation?: string
  aiConfidence?: number
  proposalDetails?: string
  evidence?: string[]
  createdAt: string
  currentStage: string
  currentOwner?: string
  comments: WorkflowComment[]
}

export type WorkflowEvent = {
  id: string
  stage: string
  status: 'Completed' | 'Current' | 'Pending' | 'Failed'
  timestamp?: string
  owner?: string
  comment?: string
}

export type WorkflowComment = {
  id: string
  authorName: string
  createdAt: string
  text: string
  action?: string
}

export type AuditLog = {
  id: string
  timestamp: string
  userName: string
  role: string
  action: string
  entity: string
  entityId: string
  previousStatus?: string
  newStatus?: string
  description: string
  source: 'Web' | 'Mobile' | 'Agent' | 'System'
}

export type FollowUpStatus =
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Overdue'
  | 'Cancelled'

export type FollowUp = {
  id: string
  title: string
  description: string
  assetName: string
  workflowId: string
  assignedUserName: string
  dueDate: string
  priority: Priority
  status: FollowUpStatus
}

export type WorkflowTimeline = {
  workflowId: string
  events: WorkflowEvent[]
}


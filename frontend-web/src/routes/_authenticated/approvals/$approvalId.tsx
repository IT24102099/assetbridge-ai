import { createFileRoute } from '@tanstack/react-router'
import { ApprovalDetailPage } from '@/features/m4/pages/approval-detail-page'
export const Route = createFileRoute('/_authenticated/approvals/$approvalId')({ component: ApprovalDetailPage })


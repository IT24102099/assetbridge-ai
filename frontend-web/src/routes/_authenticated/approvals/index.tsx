import { createFileRoute } from '@tanstack/react-router'
import { ApprovalsPage } from '@/features/m4/pages/approvals-page'
export const Route = createFileRoute('/_authenticated/approvals/')({ component: ApprovalsPage })


import { createFileRoute } from '@tanstack/react-router'
import { AuditLogsPage } from '@/features/m4/pages/audit-logs-page'
export const Route = createFileRoute('/_authenticated/audit-logs')({ component: AuditLogsPage })


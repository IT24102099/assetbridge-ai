import { Badge } from '@/components/ui/badge'
import type { ApprovalStatus, FollowUpStatus } from '../types'

const colors: Record<string, string> = {
  Approved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  Completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  Rejected: 'bg-red-500/15 text-red-700 dark:text-red-400',
  Cancelled: 'bg-slate-500/15 text-slate-700 dark:text-slate-400',
  'Revision Requested': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Overdue: 'bg-red-500/15 text-red-700 dark:text-red-400',
  'In Progress': 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
}

export function StatusBadge({
  status,
}: {
  status: ApprovalStatus | FollowUpStatus
}) {
  return (
    <Badge variant='outline' className={colors[status] ?? ''}>
      {status}
    </Badge>
  )
}


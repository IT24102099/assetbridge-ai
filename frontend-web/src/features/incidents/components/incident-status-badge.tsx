import { Badge } from '@/components/ui/badge'
import { IncidentStatus } from '../types'
import {
  FileText,
  Search,
  Wrench,
  CheckCircle2,
  CheckCheck,
} from 'lucide-react'

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  switch (status) {
    case 'Reported':
      return (
        <Badge
          variant="outline"
          className="border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300 font-medium gap-1"
        >
          <FileText className="h-3 w-3 text-slate-500" />
          Reported
        </Badge>
      )
    case 'UnderReview':
      return (
        <Badge
          variant="outline"
          className="border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium gap-1"
        >
          <Search className="h-3 w-3 text-purple-500" />
          Under Review
        </Badge>
      )
    case 'InProgress':
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium gap-1"
        >
          <Wrench className="h-3 w-3 text-amber-500" />
          In Progress
        </Badge>
      )
    case 'Resolved':
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium gap-1"
        >
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          Resolved
        </Badge>
      )
    case 'Closed':
      return (
        <Badge
          variant="outline"
          className="border-zinc-500/30 bg-zinc-500/10 text-zinc-500 font-medium gap-1"
        >
          <CheckCheck className="h-3 w-3 text-zinc-400" />
          Closed
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

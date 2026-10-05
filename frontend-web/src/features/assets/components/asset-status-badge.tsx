import { Badge } from '@/components/ui/badge'
import { AssetStatus } from '../types'
import { CheckCircle2, Wrench, Ban } from 'lucide-react'

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  switch (status) {
    case 'Active':
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5 font-medium"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Active
        </Badge>
      )
    case 'Maintenance':
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1.5 font-medium"
        >
          <Wrench className="h-3.5 w-3.5 text-amber-500" />
          Under Maintenance
        </Badge>
      )
    case 'Decommissioned':
      return (
        <Badge
          variant="outline"
          className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 gap-1.5 font-medium"
        >
          <Ban className="h-3.5 w-3.5 text-rose-500" />
          Decommissioned
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

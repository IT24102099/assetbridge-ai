import { Badge } from '@/components/ui/badge'
import { IncidentSeverity } from '../types'
import { Flame, AlertTriangle, AlertCircle, Info } from 'lucide-react'

export function IncidentSeverityBadge({ severity }: { severity: IncidentSeverity }) {
  switch (severity) {
    case 'Critical':
      return (
        <Badge
          variant="outline"
          className="border-red-500/40 bg-red-500/15 text-red-600 dark:text-red-400 font-semibold gap-1"
        >
          <Flame className="h-3 w-3 text-red-500" />
          Critical
        </Badge>
      )
    case 'High':
      return (
        <Badge
          variant="outline"
          className="border-orange-500/40 bg-orange-500/15 text-orange-600 dark:text-orange-400 font-medium gap-1"
        >
          <AlertTriangle className="h-3 w-3 text-orange-500" />
          High
        </Badge>
      )
    case 'Medium':
      return (
        <Badge
          variant="outline"
          className="border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium gap-1"
        >
          <AlertCircle className="h-3 w-3 text-amber-500" />
          Medium
        </Badge>
      )
    case 'Low':
      return (
        <Badge
          variant="outline"
          className="border-blue-500/40 bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium gap-1"
        >
          <Info className="h-3 w-3 text-blue-500" />
          Low
        </Badge>
      )
    default:
      return <Badge variant="secondary">{severity}</Badge>
  }
}

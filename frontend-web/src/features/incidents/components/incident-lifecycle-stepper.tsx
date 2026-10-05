import { IncidentStatus } from '../types'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Search,
  Wrench,
  CheckCircle2,
  Check,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { incidentsApi } from '../api/incidents-api'
import { toast } from 'sonner'

interface IncidentLifecycleStepperProps {
  incidentId: number
  currentStatus: IncidentStatus
  onStatusChanged?: () => void
  readOnly?: boolean
}

const STEPS: { status: IncidentStatus; label: string; icon: typeof FileText }[] = [
  { status: 'Reported', label: 'Reported', icon: FileText },
  { status: 'UnderReview', label: 'Under Review', icon: Search },
  { status: 'InProgress', label: 'In Progress', icon: Wrench },
  { status: 'Resolved', label: 'Resolved', icon: CheckCircle2 },
]

export function IncidentLifecycleStepper({
  incidentId,
  currentStatus,
  onStatusChanged,
  readOnly = false,
}: IncidentLifecycleStepperProps) {
  const [loading, setLoading] = useState(false)

  const getStepIndex = (status: IncidentStatus) => {
    if (status === 'Closed') return 4
    return STEPS.findIndex((s) => s.status === status)
  }

  const currentIndex = getStepIndex(currentStatus)

  const handleAdvanceStatus = async (newStatus: IncidentStatus) => {
    setLoading(true)
    try {
      await incidentsApi.updateStatus(incidentId, {
        status: newStatus,
        notes: `Advanced to ${newStatus} from Web Console`,
      })
      toast.success(`Incident moved to '${newStatus}'`)
      onStatusChanged?.()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Horizontal Steps Progress Bar */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, (currentIndex / (STEPS.length - 1)) * 100))}%`,
            }}
          />
        </div>

        {STEPS.map((step, idx) => {
          const StepIcon = step.icon
          const isDone = currentIndex > idx
          const isCurrent = currentIndex === idx

          return (
            <div
              key={step.status}
              className="flex flex-col items-center gap-1.5 z-10 bg-background px-1.5"
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  isDone
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isCurrent
                      ? 'border-primary bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20'
                      : 'border-muted-foreground/30 bg-muted text-muted-foreground'
                }`}
              >
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-xs font-medium text-center whitespace-nowrap ${
                  isCurrent
                    ? 'text-primary font-bold'
                    : isDone
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Quick Action Progression Controls */}
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs">
          <span className="text-muted-foreground">
            Current stage: <strong className="text-foreground">{currentStatus}</strong>
          </span>

          <div className="flex items-center gap-2">
            {currentStatus === 'Reported' && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs border-purple-500/30 text-purple-600 hover:bg-purple-500/10"
                onClick={() => handleAdvanceStatus('UnderReview')}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                Start Review
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}

            {currentStatus === 'UnderReview' && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                onClick={() => handleAdvanceStatus('InProgress')}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wrench className="h-3.5 w-3.5" />}
                Dispatch Work
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}

            {currentStatus === 'InProgress' && (
              <Button
                size="sm"
                variant="default"
                className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleAdvanceStatus('Resolved')}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Mark as Resolved
              </Button>
            )}

            {currentStatus === 'Resolved' && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs"
                onClick={() => handleAdvanceStatus('Closed')}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Archive & Close
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

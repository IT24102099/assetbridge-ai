import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Incident } from '../types'
import { IncidentSeverityBadge } from './incident-severity-badge'
import { IncidentStatusBadge } from './incident-status-badge'
import { IncidentLifecycleStepper } from './incident-lifecycle-stepper'
import { incidentsApi } from '../api/incidents-api'
import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  FileText,
  Camera,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Wrench,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { format } from 'date-fns'

interface IncidentDetailsDialogProps {
  incident: Incident | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChanged?: () => void
}

export function IncidentDetailsDialog({
  incident,
  open,
  onOpenChange,
  onStatusChanged,
}: IncidentDetailsDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [agentPlan, setAgentPlan] = useState<any | null>(null)
  const [planningLoading, setPlanningLoading] = useState(false)
  const [showPlanDetails, setShowPlanDetails] = useState(true)

  if (!incident) return null

  const handleRunAgent = async () => {
    setPlanningLoading(true)
    try {
      const plan = await incidentsApi.planIncident(incident.id)
      setAgentPlan(plan)
      setShowPlanDetails(true)
    } finally {
      setPlanningLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
            <div>
              <div className="flex items-center gap-2">
                <IncidentSeverityBadge severity={incident.severity} />
                <IncidentStatusBadge status={incident.status} />
              </div>
              <DialogTitle className="text-xl font-bold mt-2">
                {incident.title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Incident #{incident.id} • Reported on{' '}
                {format(new Date(incident.createdAt), 'PPP p')}
              </DialogDescription>
            </div>

            {/* Run Agent Trigger */}
            <Button
              size="sm"
              onClick={handleRunAgent}
              disabled={planningLoading}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shrink-0 self-start sm:self-auto shadow-sm"
            >
              {planningLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {agentPlan ? 'Refresh AI Plan' : 'Run Planning Agent'}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Agent Plan Section (when generated) */}
          {agentPlan && (
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 via-blue-500/5 to-transparent p-4 space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowPlanDetails(!showPlanDetails)}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
                      Incident Planning Agent (Member 1 AI Component)
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Target: {agentPlan.requiredSpecialization} • Priority: {agentPlan.priority}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  {showPlanDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              {showPlanDetails && (
                <div className="space-y-4 pt-2 border-t border-indigo-500/20 text-xs">
                  {/* Objective & Next Action */}
                  <div className="bg-background/80 p-3 rounded-lg border space-y-2">
                    <div>
                      <span className="font-semibold text-primary">Strategic Objective:</span>
                      <p className="text-foreground mt-0.5">{agentPlan.objective}</p>
                    </div>
                    {agentPlan.nextRecommendedAction && (
                      <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-medium">
                        🚨 Immediate Action: {agentPlan.nextRecommendedAction}
                      </div>
                    )}
                  </div>

                  {/* RAG Knowledge Retrieval */}
                  {agentPlan.ragKnowledge && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                        <span>RAG Maintenance Knowledge Base Matches</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {agentPlan.ragKnowledge.retrievedDocuments?.map((doc: any) => (
                          <div key={doc.id} className="p-2.5 rounded-lg bg-card border space-y-1">
                            <span className="font-mono text-[10px] text-primary">{doc.id}</span>
                            <div className="font-semibold text-foreground line-clamp-1">{doc.title}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-2">{doc.content}</div>
                            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                              Trade: {doc.recommendedTrade}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tool Call Invocations */}
                  {agentPlan.toolCallsExecuted && (
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1.5">
                        <Wrench className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Agent Tools Executed ({agentPlan.toolCallsExecuted.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {agentPlan.toolCallsExecuted.map((tc: any, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/60 border font-mono text-[10px] text-foreground"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            {tc.toolName}()
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Multi-Step Execution Plan */}
                  {agentPlan.executionPlan && (
                    <div className="space-y-2">
                      <div className="font-semibold text-foreground">
                        Multi-Step Cross-Functional Execution Plan
                      </div>
                      <div className="space-y-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {agentPlan.executionPlan.map((step: any) => (
                          <div
                            key={step.stepNumber}
                            className="p-2.5 rounded-lg bg-card border flex items-start gap-2.5"
                          >
                            <span className="h-5 w-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                              {step.stepNumber}
                            </span>
                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground">{step.name}</span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  {step.estimatedDuration}
                                </span>
                              </div>
                              <div className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                                {step.assignedComponent}
                              </div>
                              <p className="text-muted-foreground text-[11px]">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Lifecycle Tracker Stepper Box */}
          <div className="bg-muted/40 p-4 rounded-xl border space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Resolution Workflow & Status Tracker
            </h4>
            <IncidentLifecycleStepper
              incidentId={incident.id}
              currentStatus={incident.status}
              onStatusChanged={onStatusChanged}
            />
          </div>

          {/* Linked Asset & Financials Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-4 rounded-xl border text-sm">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-primary font-medium">
                <Building2 className="h-4 w-4" />
                <span>{incident.assetName || `Asset #${incident.assetId}`}</span>
                {incident.assetCode && (
                  <span className="font-mono text-xs text-muted-foreground">
                    ({incident.assetCode})
                  </span>
                )}
              </div>

              {incident.assetLocation && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{incident.assetLocation}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Created {format(new Date(incident.createdAt), 'PPP')}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {incident.budget && (
                <div className="flex items-center gap-2 text-xs">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-muted-foreground">Allocated Budget:</span>
                  <span className="font-semibold text-foreground">
                    LKR {incident.budget.toLocaleString()}
                  </span>
                </div>
              )}

              {incident.preferredDate && (
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-muted-foreground">Target Resolution:</span>
                  <span className="font-medium text-foreground">
                    {format(new Date(incident.preferredDate), 'PPP')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-muted-foreground">Severity:</span>
                <span className="font-semibold text-foreground">{incident.severity}</span>
              </div>
            </div>
          </div>

          {/* Incident Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-primary" />
              <span>Incident Description & Root Cause Notes</span>
            </div>
            <p className="text-sm bg-muted/20 p-3.5 rounded-lg border text-foreground leading-relaxed whitespace-pre-wrap">
              {incident.description}
            </p>
          </div>

          {/* Attached Evidence & Photos */}
          {(incident.photoUrl || incident.evidences?.length > 0) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Camera className="h-4 w-4 text-primary" />
                <span>Attached Inspection Photos & Evidence</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incident.photoUrl && (
                  <div className="relative rounded-lg overflow-hidden border bg-black/5 aspect-video flex items-center justify-center">
                    <img
                      src={incident.photoUrl}
                      alt="Incident Evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {incident.evidences
                  ?.filter((e) => e.fileUrl !== incident.photoUrl)
                  .map((e) => (
                    <div
                      key={e.id}
                      className="relative rounded-lg overflow-hidden border bg-black/5 aspect-video flex items-center justify-center"
                    >
                      <img
                        src={e.fileUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

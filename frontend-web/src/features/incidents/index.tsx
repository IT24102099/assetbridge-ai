import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IncidentList } from './components/incident-list'
import { IncidentReportDialog } from './components/incident-report-dialog'
import { incidentsApi } from './api/incidents-api'
import { Incident } from './types'
import {
  TriangleAlert,
  Flame,
  Wrench,
  CheckCircle2,
  RefreshCw,
  Plus,
} from 'lucide-react'

export function IncidentsFeature() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [reportOpen, setReportOpen] = useState(false)

  const fetchIncidents = async () => {
    setLoading(true)
    try {
      const data = await incidentsApi.getAll()
      setIncidents(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  // KPI Calculations
  const totalIncidents = incidents.length
  const criticalHigh = incidents.filter(
    (i) => i.severity === 'Critical' || i.severity === 'High'
  ).length
  const inProgress = incidents.filter(
    (i) => i.status === 'InProgress' || i.status === 'UnderReview'
  ).length
  const resolved = incidents.filter(
    (i) => i.status === 'Resolved' || i.status === 'Closed'
  ).length

  return (
    <>
      <Header fixed>
        <div className="flex items-center gap-2">
          <TriangleAlert className="h-5 w-5 text-amber-500" />
          <h1 className="text-base font-semibold">Incident Triage & Tracking</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-6">
          {/* Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Incident Management</h2>
              <p className="text-sm text-muted-foreground">
                Report infrastructure failures, monitor emergency triage, and track dispatch repairs across Sri Lanka.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchIncidents}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => setReportOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Report Incident
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <TriangleAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIncidents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime reported issues
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-red-500/20 bg-red-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                  Critical & High Priority
                </CardTitle>
                <Flame className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {criticalHigh}
                </div>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                  Immediate response needed
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-amber-500/20 bg-amber-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Active Dispatch / Review
                </CardTitle>
                <Wrench className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {inProgress}
                </div>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                  Under review or in repair
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Resolved / Closed
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {resolved}
                </div>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                  Restored to operation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main List */}
          <IncidentList
            incidents={incidents}
            loading={loading}
            onRefresh={fetchIncidents}
          />
        </div>
      </Main>

      <IncidentReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSuccess={fetchIncidents}
      />
    </>
  )
}
export default IncidentsFeature

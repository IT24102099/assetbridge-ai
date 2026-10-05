import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Incident } from '../types'
import { IncidentSeverityBadge } from './incident-severity-badge'
import { IncidentStatusBadge } from './incident-status-badge'
import { IncidentDetailsDialog } from './incident-details-dialog'
import { IncidentReportDialog } from './incident-report-dialog'
import { incidentsApi } from '../api/incidents-api'
import { toast } from 'sonner'
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  TriangleAlert,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { format } from 'date-fns'

interface IncidentListProps {
  incidents: Incident[]
  loading: boolean
  onRefresh: () => void
}

const PAGE_SIZE = 6

export function IncidentList({
  incidents,
  loading,
  onRefresh,
}: IncidentListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchSearch =
        search === '' ||
        incident.title.toLowerCase().includes(search.toLowerCase()) ||
        incident.description.toLowerCase().includes(search.toLowerCase()) ||
        (incident.assetName &&
          incident.assetName.toLowerCase().includes(search.toLowerCase())) ||
        (incident.assetCode &&
          incident.assetCode.toLowerCase().includes(search.toLowerCase()))

      const matchStatus =
        statusFilter === 'all' || incident.status === statusFilter

      const matchSeverity =
        severityFilter === 'all' || incident.severity === severityFilter

      return matchSearch && matchStatus && matchSeverity
    })
  }, [incidents, search, statusFilter, severityFilter])

  // Pagination
  const totalPages = Math.ceil(filteredIncidents.length / PAGE_SIZE) || 1
  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredIncidents.slice(start, start + PAGE_SIZE)
  }, [filteredIncidents, currentPage])

  const handleDelete = async (incident: Incident) => {
    if (!confirm(`Are you sure you want to delete incident '${incident.title}'?`)) {
      return
    }

    try {
      await incidentsApi.delete(incident.id)
      toast.success(`Incident #${incident.id} deleted`)
      onRefresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete incident'
      toast.error(msg)
    }
  }

  const handleOpenDetails = (incident: Incident) => {
    setSelectedIncident(incident)
    setDetailsOpen(true)
  }

  const handleQuickResolve = async (incident: Incident) => {
    try {
      await incidentsApi.updateStatus(incident.id, {
        status: 'Resolved',
        notes: 'Marked resolved via quick action',
      })
      toast.success(`Incident #${incident.id} marked as Resolved`)
      onRefresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status'
      toast.error(msg)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-4 rounded-xl border shadow-xs">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, asset, defect..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:inline" />
            <Select
              value={severityFilter}
              onValueChange={(val) => {
                setSeverityFilter(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="UnderReview">Under Review</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={() => setReportOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Report Incident
        </Button>
      </div>

      {/* Incidents Table */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Incident / Defect</TableHead>
              <TableHead className="font-semibold">Linked Asset</TableHead>
              <TableHead className="font-semibold">Severity</TableHead>
              <TableHead className="font-semibold">Status Stage</TableHead>
              <TableHead className="font-semibold">Reported Date</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Loading incidents registry...
                </TableCell>
              </TableRow>
            ) : paginatedIncidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <TriangleAlert className="h-8 w-8 text-muted-foreground/50 mb-1" />
                    <p className="font-medium">No incidents reported</p>
                    <p className="text-xs">All infrastructure units operating normally</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedIncidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => handleOpenDetails(incident)}
                >
                  <TableCell>
                    <div className="font-semibold text-foreground">{incident.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 max-w-sm">
                      {incident.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium text-sm">
                      <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{incident.assetName || `Asset #${incident.assetId}`}</span>
                    </div>
                    {incident.assetCode && (
                      <div className="text-xs font-mono text-muted-foreground">
                        {incident.assetCode}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <IncidentSeverityBadge severity={incident.severity} />
                  </TableCell>
                  <TableCell>
                    <IncidentStatusBadge status={incident.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(incident.createdAt), 'PP')}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Incident Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDetails(incident)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details & Tracker
                        </DropdownMenuItem>
                        {incident.status !== 'Resolved' && incident.status !== 'Closed' && (
                          <DropdownMenuItem onClick={() => handleQuickResolve(incident)}>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                            Mark as Resolved
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(incident)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Incident
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-sm">
          <div className="text-muted-foreground text-xs">
            Showing{' '}
            <span className="font-medium">
              {filteredIncidents.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * PAGE_SIZE, filteredIncidents.length)}
            </span>{' '}
            of <span className="font-medium">{filteredIncidents.length}</span> incidents
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-xs font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <IncidentDetailsDialog
        incident={selectedIncident}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onStatusChanged={() => {
          onRefresh()
          // Update selected incident in dialog
          if (selectedIncident) {
            incidentsApi.getById(selectedIncident.id).then((updated) => {
              if (updated) setSelectedIncident(updated)
            })
          }
        }}
      />

      <IncidentReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSuccess={onRefresh}
      />
    </div>
  )
}

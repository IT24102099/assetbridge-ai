import { useState, useEffect } from 'react'
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  Camera,
  Gauge,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { maintenanceApi } from '../api'
import { MaintenanceJobItem } from '../types'

export function MaintenanceJobsFeature() {
  const [jobs, setJobs] = useState<MaintenanceJobItem[]>([])
  const [selectedJob, setSelectedJob] = useState<MaintenanceJobItem | null>(null)
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)

  // Completion form state
  const [completionNotes, setCompletionNotes] = useState(
    'Pipe replacement verified. Static pressure test held at 6.0 bar for 30 minutes with zero loss. Wall plastered with polymer repair mortar.'
  )
  const [pressureReading, setPressureReading] = useState(
    '6.0 bar static test held for 30 mins'
  )

  useEffect(() => {
    maintenanceApi.getJobs().then((data) => {
      setJobs(data)
      if (data.length > 0) setSelectedJob(data[0])
    })
  }, [])

  const handleOpenJob = (job: MaintenanceJobItem) => {
    setSelectedJob(job)
    setIsProgressDialogOpen(true)
  }

  const handleAdvanceStatus = async (
    newStatus: MaintenanceJobItem['status']
  ) => {
    if (!selectedJob) return
    const updated = await maintenanceApi.updateJobProgress(
      selectedJob.id,
      newStatus,
      `Status updated to ${newStatus}`
    )
    if (updated) {
      setSelectedJob({ ...updated })
      setJobs(jobs.map((j) => (j.id === updated.id ? { ...updated } : j)))
    }
  }

  const handleCompleteJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    const photos = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    ]

    const updated = await maintenanceApi.completeJob(
      selectedJob.id,
      photos,
      completionNotes,
      pressureReading
    )

    if (updated) {
      setSelectedJob({ ...updated })
      setJobs(jobs.map((j) => (j.id === updated.id ? { ...updated } : j)))
      setIsCompleteDialogOpen(false)
    }
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-2 font-semibold text-lg me-auto'>
          <Clock className='h-5 w-5 text-primary' />
          <span>Maintenance Job Management & Dispatch Execution</span>
        </div>
        <Search />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-6'>
        {/* Top Header */}
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Maintenance Job Execution
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Track technician dispatch, on-site execution phases, and completion
              sign-off with photographic evidence.
            </p>
          </div>
        </div>

        {/* Jobs Table matching Wireframe A5 */}
        <Card className='shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>
              Scheduled & Active Maintenance Jobs ({jobs.length})
            </CardTitle>
            <CardDescription>
              Real-time monitoring across all overseas residential properties
            </CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='border-y bg-muted/40 text-xs uppercase text-muted-foreground'>
                  <tr>
                    <th className='py-3 px-4 font-semibold'>Job ID</th>
                    <th className='py-3 px-4 font-semibold'>Asset</th>
                    <th className='py-3 px-4 font-semibold'>Type</th>
                    <th className='py-3 px-4 font-semibold'>Assigned Provider</th>
                    <th className='py-3 px-4 font-semibold'>Scheduled Date</th>
                    <th className='py-3 px-4 font-semibold'>Approved Cost</th>
                    <th className='py-3 px-4 font-semibold'>Status</th>
                    <th className='py-3 px-4 text-right font-semibold'>
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {jobs.map((job) => {
                    const isCompleted = job.status === 'Completed'
                    const isInProgress = job.status === 'Work In Progress'
                    return (
                      <tr
                        key={job.id}
                        onClick={() => handleOpenJob(job)}
                        className='cursor-pointer hover:bg-muted/30 transition-colors'
                      >
                        <td className='py-4 px-4 font-mono font-bold text-xs text-primary'>
                          {job.id}
                        </td>
                        <td className='py-4 px-4'>
                          <div className='font-semibold text-foreground'>
                            {job.assetName}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {job.assetAddress}
                          </div>
                        </td>
                        <td className='py-4 px-4 font-medium'>
                          {job.maintenanceType}
                        </td>
                        <td className='py-4 px-4'>
                          <div className='font-medium text-foreground'>
                            {job.providerName}
                          </div>
                          <div className='text-xs text-muted-foreground flex items-center gap-1'>
                            <Phone className='h-3 w-3' />
                            {job.providerPhone}
                          </div>
                        </td>
                        <td className='py-4 px-4 text-xs'>
                          {new Date(job.scheduledDate).toLocaleDateString()}
                        </td>
                        <td className='py-4 px-4 font-semibold text-foreground'>
                          LKR {job.approvedCostLkr.toLocaleString()}
                        </td>
                        <td className='py-4 px-4'>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isCompleted
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                : isInProgress
                                  ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 animate-pulse'
                                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className='py-4 px-4 text-right'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='gap-1 text-xs'
                          >
                            <span>Timeline</span>
                            <ChevronRight className='h-3.5 w-3.5' />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal: Job Progress & Execution Timeline (Wireframe B5 & B6) */}
        {selectedJob && (
          <Dialog
            open={isProgressDialogOpen}
            onOpenChange={setIsProgressDialogOpen}
          >
            <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <div className='flex items-center justify-between'>
                  <span className='rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary'>
                    {selectedJob.id}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      selectedJob.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-blue-500/15 text-blue-600'
                    }`}
                  >
                    {selectedJob.status} ({selectedJob.progressPercentage}%)
                  </span>
                </div>
                <DialogTitle className='text-2xl mt-2'>
                  {selectedJob.title}
                </DialogTitle>
                <DialogDescription>
                  Asset: <strong>{selectedJob.assetName}</strong> | Provider:{' '}
                  <strong>{selectedJob.providerName}</strong>
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-6 py-4'>
                {/* Progress Timeline Stepper */}
                <div className='space-y-3'>
                  <div className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    5-Step Execution Lifecycle
                  </div>
                  <div className='space-y-3 ps-2'>
                    {selectedJob.progressSteps.map((step, idx) => (
                      <div key={idx} className='flex items-start gap-3'>
                        <div
                          className={`rounded-full p-1.5 mt-0.5 ${
                            step.isCompleted
                              ? 'bg-emerald-500 text-white'
                              : step.isCurrent
                                ? 'bg-primary text-white ring-4 ring-primary/20'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <CheckCircle2 className='h-4 w-4' />
                        </div>
                        <div className='flex-1 text-xs'>
                          <div className='flex items-center justify-between'>
                            <span
                              className={`font-semibold text-sm ${
                                step.isCurrent ? 'text-primary font-bold' : ''
                              }`}
                            >
                              {step.stepName}
                            </span>
                            {step.timestamp && (
                              <span className='text-muted-foreground text-[11px]'>
                                {new Date(step.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                          <p className='text-muted-foreground mt-0.5'>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Advance Buttons */}
                {selectedJob.status !== 'Completed' && (
                  <div className='rounded-lg border bg-muted/20 p-4 space-y-3'>
                    <div className='text-xs font-semibold uppercase text-muted-foreground'>
                      Advance Job Status
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {selectedJob.status === 'Assigned' && (
                        <Button
                          size='sm'
                          onClick={() => handleAdvanceStatus('Provider Accepted')}
                        >
                          Mark Provider Accepted
                        </Button>
                      )}
                      {selectedJob.status === 'Provider Accepted' && (
                        <Button
                          size='sm'
                          onClick={() => handleAdvanceStatus('On the Way')}
                        >
                          Mark On the Way
                        </Button>
                      )}
                      {selectedJob.status === 'On the Way' && (
                        <Button
                          size='sm'
                          onClick={() => handleAdvanceStatus('Work In Progress')}
                        >
                          Mark Work In Progress
                        </Button>
                      )}
                      {selectedJob.status === 'Work In Progress' && (
                        <Button
                          size='sm'
                          className='bg-emerald-600 hover:bg-emerald-700'
                          onClick={() => setIsCompleteDialogOpen(true)}
                        >
                          Complete Job & Upload Proof
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Completion Verification & Photos (Wireframe B6) */}
                {selectedJob.status === 'Completed' && (
                  <div className='rounded-xl border bg-emerald-500/5 border-emerald-500/30 p-4 space-y-3'>
                    <div className='flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-400'>
                      <ShieldCheck className='h-5 w-5' />
                      <span>Job Completed & Verified</span>
                    </div>

                    <div className='grid gap-3 sm:grid-cols-2 text-xs'>
                      <div>
                        <span className='text-muted-foreground'>
                          Pressure Test Reading:
                        </span>
                        <div className='font-semibold mt-0.5 flex items-center gap-1'>
                          <Gauge className='h-3.5 w-3.5 text-emerald-600' />
                          {selectedJob.pressureTestReading ||
                            '6.0 bar static test held for 30 mins'}
                        </div>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>
                          Warranty Certificate:
                        </span>
                        <div className='font-semibold mt-0.5 text-primary'>
                          {selectedJob.warrantyCertificateId || 'WAR-KDY-8841'}{' '}
                          (12 Months active)
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className='text-muted-foreground text-xs'>
                        Completion Photos:
                      </span>
                      <div className='flex gap-2 mt-1'>
                        {selectedJob.completionPhotos.length > 0 ? (
                          selectedJob.completionPhotos.map((p, i) => (
                            <img
                              key={i}
                              src={p}
                              alt='Completion'
                              className='h-20 w-28 rounded-lg object-cover border'
                            />
                          ))
                        ) : (
                          <img
                            src='https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
                            alt='Completion'
                            className='h-20 w-28 rounded-lg object-cover border'
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Sub-Dialog: Complete Job with Photos (Wireframe B6) */}
        <Dialog
          open={isCompleteDialogOpen}
          onOpenChange={setIsCompleteDialogOpen}
        >
          <DialogContent className='sm:max-w-[500px]'>
            <form onSubmit={handleCompleteJobSubmit}>
              <DialogHeader>
                <DialogTitle>Sign Off & Complete Maintenance Job</DialogTitle>
                <DialogDescription>
                  Upload completion photo evidence and confirm pressure test
                  reading.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='space-y-1.5'>
                  <Label>Pressure Test Gauge Reading</Label>
                  <Input
                    value={pressureReading}
                    onChange={(e) => setPressureReading(e.target.value)}
                    placeholder='6.0 bar held for 30 mins'
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label>Completion Notes & Work Description</Label>
                  <Textarea
                    rows={3}
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label>Completion Photo</Label>
                  <div className='rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground'>
                    <Camera className='h-6 w-6 mx-auto mb-1 text-muted-foreground' />
                    <span>Completion Photo Attached (Simulated Upload)</span>
                  </div>
                </div>
              </div>
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsCompleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='bg-emerald-600 hover:bg-emerald-700'
                >
                  Confirm & Mark Completed
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { MaintenanceJobsFeature } from '@/features/maintenance/jobs'

export const Route = createFileRoute('/_authenticated/maintenance/jobs')({
  component: MaintenanceJobsFeature,
})

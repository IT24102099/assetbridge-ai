import { createFileRoute } from '@tanstack/react-router'
import { MaintenanceReportsFeature } from '@/features/maintenance/reports'

export const Route = createFileRoute('/_authenticated/maintenance/reports')({
  component: MaintenanceReportsFeature,
})

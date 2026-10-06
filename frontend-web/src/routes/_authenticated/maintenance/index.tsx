import { createFileRoute } from '@tanstack/react-router'
import { MaintenanceDashboard } from '@/features/maintenance/dashboard'

export const Route = createFileRoute('/_authenticated/maintenance/')({
  component: MaintenanceDashboard,
})

import { createFileRoute } from '@tanstack/react-router'
import { InspectionsFeature } from '@/features/maintenance/inspections'

export const Route = createFileRoute('/_authenticated/inspections/')({
  component: InspectionsFeature,
})

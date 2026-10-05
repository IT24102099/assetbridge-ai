import { createFileRoute } from '@tanstack/react-router'
import { IncidentsFeature } from '@/features/incidents'

export const Route = createFileRoute('/_authenticated/incidents/')({
  component: IncidentsFeature,
})

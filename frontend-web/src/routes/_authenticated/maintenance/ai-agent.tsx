import { createFileRoute } from '@tanstack/react-router'
import { Agent3StudioFeature } from '@/features/maintenance/ai-agent'

export const Route = createFileRoute('/_authenticated/maintenance/ai-agent')({
  component: Agent3StudioFeature,
})

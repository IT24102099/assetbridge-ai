import { createFileRoute } from '@tanstack/react-router'
import { AvailabilityCalendar } from '@/features/provider-coordination'

interface CalendarSearch {
  providerId?: string
}

export const Route = createFileRoute(
  '/_authenticated/provider-coordination/calendar'
)({
  validateSearch: (search: Record<string, unknown>): CalendarSearch => {
    return {
      providerId: (search.providerId as string) || undefined,
    }
  },
  component: AvailabilityCalendar,
})

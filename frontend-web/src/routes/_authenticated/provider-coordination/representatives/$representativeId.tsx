import { createFileRoute } from '@tanstack/react-router'
import { RepresentativeDetails } from '@/features/provider-coordination'

export const Route = createFileRoute(
  '/_authenticated/provider-coordination/representatives/$representativeId'
)({
  component: RepresentativeDetails,
})

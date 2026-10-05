import { createFileRoute } from '@tanstack/react-router'
import { ProviderDetails } from '@/features/provider-coordination'

export const Route = createFileRoute(
  '/_authenticated/provider-coordination/providers/$providerId'
)({
  component: ProviderDetails,
})

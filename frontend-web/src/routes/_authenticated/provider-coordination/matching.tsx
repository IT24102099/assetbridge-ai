import { createFileRoute } from '@tanstack/react-router'
import { ProviderMatching } from '@/features/provider-coordination'

export const Route = createFileRoute(
  '/_authenticated/provider-coordination/matching'
)({
  component: ProviderMatching,
})

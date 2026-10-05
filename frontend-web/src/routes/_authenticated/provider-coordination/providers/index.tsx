import { createFileRoute } from '@tanstack/react-router'
import { ProviderList } from '@/features/provider-coordination'

export const Route = createFileRoute(
  '/_authenticated/provider-coordination/providers/'
)({
  component: ProviderList,
})

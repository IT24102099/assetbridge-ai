import { createFileRoute } from '@tanstack/react-router'
import { RepresentativeList } from '@/features/provider-coordination'

export const Route = createFileRoute('/_authenticated/provider-coordination/')({
  component: RepresentativeList,
})

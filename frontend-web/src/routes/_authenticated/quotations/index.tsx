import { createFileRoute } from '@tanstack/react-router'
import { QuotationsFeature } from '@/features/maintenance/quotations'

export const Route = createFileRoute('/_authenticated/quotations/')({
  component: QuotationsFeature,
})

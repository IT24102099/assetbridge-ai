import { createFileRoute } from '@tanstack/react-router'
import { QuotationComparisonFeature } from '@/features/maintenance/quotations/compare'

export const Route = createFileRoute('/_authenticated/quotations/compare')({
  component: QuotationComparisonFeature,
})

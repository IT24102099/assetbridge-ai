import { createFileRoute } from '@tanstack/react-router'
import { CatalogFeature } from '@/features/maintenance/catalog'

export const Route = createFileRoute('/_authenticated/maintenance/catalog')({
  component: CatalogFeature,
})

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ProviderCoordinationProvider } from '@/features/provider-coordination'

export const Route = createFileRoute('/_authenticated/provider-coordination')({
  component: () => (
    <ProviderCoordinationProvider>
      <Outlet />
    </ProviderCoordinationProvider>
  ),
})

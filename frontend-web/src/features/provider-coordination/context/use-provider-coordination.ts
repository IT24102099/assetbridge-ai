import { useContext } from 'react'
import { ProviderCoordinationContext } from './provider-coordination-context'

export function useProviderCoordination() {
  const context = useContext(ProviderCoordinationContext)
  if (!context) {
    throw new Error('useProviderCoordination must be used within ProviderCoordinationProvider')
  }
  return context
}

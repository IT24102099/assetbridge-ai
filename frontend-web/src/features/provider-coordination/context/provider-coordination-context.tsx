import React, { createContext, useState, useEffect } from 'react'
import type {
  Representative,
  ServiceProvider,
  AvailabilitySlot,
  ProviderMatchCriteria,
  ProviderMatchResult,
} from '../types'
import {
  initialRepresentatives,
  initialProviders,
  initialAvailabilitySlots,
} from '../data/mock-data'
import { calculateProviderMatch } from '../utils/matching'
import {
  fetchRepresentativesApi,
  createRepresentativeApi,
  updateRepresentativeApi,
  deleteRepresentativeApi,
  fetchProvidersApi,
  createProviderApi,
  updateProviderApi,
  deleteProviderApi,
  fetchProviderAvailabilityApi,
  createAvailabilitySlotApi,
  updateAvailabilitySlotApi,
  deleteAvailabilitySlotApi,
} from '../services/provider-coordination-api'

interface ProviderCoordinationContextType {
  representatives: Representative[]
  providers: ServiceProvider[]
  availabilitySlots: AvailabilitySlot[]
  
  // Representative actions
  addRepresentative: (data: Omit<Representative, 'id' | 'code' | 'assignedProvidersCount' | 'activeTasks'>) => void
  updateRepresentative: (id: string, data: Partial<Representative>) => void
  deleteRepresentative: (id: string) => void

  // Provider actions
  addProvider: (data: Omit<ServiceProvider, 'id' | 'code' | 'completedJobs' | 'satisfactionRate'>) => void
  updateProvider: (id: string, data: Partial<ServiceProvider>) => void
  deleteProvider: (id: string) => void
  assignRepresentativeToProvider: (providerId: string, representativeId: string) => void

  // Availability Slot actions
  addAvailabilitySlot: (slot: Omit<AvailabilitySlot, 'id'>) => void
  updateAvailabilitySlot: (id: string, data: Partial<AvailabilitySlot>) => void
  deleteAvailabilitySlot: (id: string) => void
  bookAvailabilitySlot: (slotId: string, taskTitle: string, representativeName?: string, notes?: string) => void

  // Matching algorithm
  runMatchingEngine: (criteria: ProviderMatchCriteria) => ProviderMatchResult[]
}

export const ProviderCoordinationContext = createContext<ProviderCoordinationContextType | undefined>(undefined)

export { useProviderCoordination } from './use-provider-coordination'

export function ProviderCoordinationProvider({ children }: { children: React.ReactNode }) {
  const [representatives, setRepresentatives] = useState<Representative[]>(initialRepresentatives)
  const [providers, setProviders] = useState<ServiceProvider[]>(initialProviders)
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(initialAvailabilitySlots)

  // Fetch initial state from backend APIs
  useEffect(() => {
    let isMounted = true
    async function loadBackendData() {
      const reps = await fetchRepresentativesApi()
      if (reps && isMounted) {
        setRepresentatives(reps)
      }

      const provs = await fetchProvidersApi()
      if (provs && isMounted) {
        setProviders(provs)

        // Fetch availability slots for first provider
        if (provs.length > 0) {
          const slots = await fetchProviderAvailabilityApi(provs[0].id)
          if (slots && isMounted && slots.length > 0) {
            setAvailabilitySlots(slots)
          }
        }
      }
    }
    loadBackendData()
    return () => {
      isMounted = false
    }
  }, [])

  // Add Representative
  const addRepresentative = (
    data: Omit<Representative, 'id' | 'code' | 'assignedProvidersCount' | 'activeTasks'>
  ) => {
    const newRep: Representative = {
      ...data,
      id: `rep-${Date.now()}`,
      code: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      assignedProvidersCount: 0,
      activeTasks: 0,
    }
    setRepresentatives((prev) => [newRep, ...prev])
    createRepresentativeApi(data)
  }

  // Update Representative
  const updateRepresentative = (id: string, data: Partial<Representative>) => {
    setRepresentatives((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, ...data } : rep))
    )
    if (data.name) {
      setProviders((prev) =>
        prev.map((p) =>
          p.assignedRepresentativeId === id ? { ...p, representativeName: data.name! } : p
        )
      )
    }
    updateRepresentativeApi(id, data)
  }

  // Delete Representative
  const deleteRepresentative = (id: string) => {
    setRepresentatives((prev) => prev.filter((r) => r.id !== id))
    setProviders((prev) =>
      prev.map((p) =>
        p.assignedRepresentativeId === id
          ? { ...p, assignedRepresentativeId: '', representativeName: 'Unassigned' }
          : p
      )
    )
    deleteRepresentativeApi(id)
  }

  // Add Provider
  const addProvider = (
    data: Omit<ServiceProvider, 'id' | 'code' | 'completedJobs' | 'satisfactionRate'>
  ) => {
    const rep = representatives.find((r) => r.id === data.assignedRepresentativeId)
    const newProvider: ServiceProvider = {
      ...data,
      id: `prov-${Date.now()}`,
      code: `SP-${Math.floor(2000 + Math.random() * 9000)}`,
      completedJobs: 0,
      satisfactionRate: 100,
      representativeName: rep ? rep.name : 'Unassigned',
    }
    setProviders((prev) => [newProvider, ...prev])

    if (data.assignedRepresentativeId) {
      setRepresentatives((prev) =>
        prev.map((r) =>
          r.id === data.assignedRepresentativeId
            ? { ...r, assignedProvidersCount: r.assignedProvidersCount + 1 }
            : r
        )
      )
    }
    createProviderApi(data)
  }

  // Update Provider
  const updateProvider = (id: string, data: Partial<ServiceProvider>) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    )
    updateProviderApi(id, data)
  }

  // Delete Provider
  const deleteProvider = (id: string) => {
    const prov = providers.find((p) => p.id === id)
    if (prov && prov.assignedRepresentativeId) {
      setRepresentatives((prev) =>
        prev.map((r) =>
          r.id === prov.assignedRepresentativeId
            ? { ...r, assignedProvidersCount: Math.max(0, r.assignedProvidersCount - 1) }
            : r
        )
      )
    }
    setProviders((prev) => prev.filter((p) => p.id !== id))
    setAvailabilitySlots((prev) => prev.filter((s) => s.providerId !== id))
    deleteProviderApi(id)
  }

  // Assign Representative to Provider
  const assignRepresentativeToProvider = (providerId: string, representativeId: string) => {
    const prov = providers.find((p) => p.id === providerId)
    const newRep = representatives.find((r) => r.id === representativeId)

    if (!prov) return

    const oldRepId = prov.assignedRepresentativeId

    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? {
              ...p,
              assignedRepresentativeId: representativeId,
              representativeName: newRep ? newRep.name : 'Unassigned',
            }
          : p
      )
    )

    setRepresentatives((prev) =>
      prev.map((r) => {
        if (r.id === oldRepId && oldRepId !== representativeId) {
          return { ...r, assignedProvidersCount: Math.max(0, r.assignedProvidersCount - 1) }
        }
        if (r.id === representativeId && oldRepId !== representativeId) {
          return { ...r, assignedProvidersCount: r.assignedProvidersCount + 1 }
        }
        return r
      })
    )
    updateProviderApi(providerId, { assignedRepresentativeId: representativeId })
  }

  // Add Availability Slot
  const addAvailabilitySlot = (slot: Omit<AvailabilitySlot, 'id'>) => {
    const newSlot: AvailabilitySlot = {
      ...slot,
      id: `slot-${Date.now()}`,
    }
    setAvailabilitySlots((prev) => [...prev, newSlot])
    createAvailabilitySlotApi(slot.providerId, slot)
  }

  // Update Availability Slot
  const updateAvailabilitySlot = (id: string, data: Partial<AvailabilitySlot>) => {
    setAvailabilitySlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    )
    const slot = availabilitySlots.find((s) => s.id === id)
    if (slot) {
      updateAvailabilitySlotApi(slot.providerId, id, data)
    }
  }

  // Delete Availability Slot
  const deleteAvailabilitySlot = (id: string) => {
    const slot = availabilitySlots.find((s) => s.id === id)
    setAvailabilitySlots((prev) => prev.filter((s) => s.id !== id))
    if (slot) {
      deleteAvailabilitySlotApi(slot.providerId, id)
    }
  }

  // Book Availability Slot
  const bookAvailabilitySlot = (
    slotId: string,
    taskTitle: string,
    representativeName?: string,
    notes?: string
  ) => {
    setAvailabilitySlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              status: 'booked',
              taskTitle,
              representativeName: representativeName || s.representativeName,
              notes: notes || s.notes,
            }
          : s
      )
    )
    const slot = availabilitySlots.find((s) => s.id === slotId)
    if (slot) {
      updateAvailabilitySlotApi(slot.providerId, slotId, {
        status: 'booked',
        notes: notes || taskTitle,
      })
    }
  }

  // Matching Engine
  const runMatchingEngine = (criteria: ProviderMatchCriteria): ProviderMatchResult[] => {
    // Synchronous matching calculation for immediate responsive UI feedback
    return providers
      .map((prov) => calculateProviderMatch(prov, criteria, availabilitySlots))
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  return (
    <ProviderCoordinationContext.Provider
      value={{
        representatives,
        providers,
        availabilitySlots,
        addRepresentative,
        updateRepresentative,
        deleteRepresentative,
        addProvider,
        updateProvider,
        deleteProvider,
        assignRepresentativeToProvider,
        addAvailabilitySlot,
        updateAvailabilitySlot,
        deleteAvailabilitySlot,
        bookAvailabilitySlot,
        runMatchingEngine,
      }}
    >
      {children}
    </ProviderCoordinationContext.Provider>
  )
}

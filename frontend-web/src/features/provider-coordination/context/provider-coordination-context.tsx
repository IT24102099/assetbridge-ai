import React, { createContext, useState } from 'react'
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
  }

  // Update Provider
  const updateProvider = (id: string, data: Partial<ServiceProvider>) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    )
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
  }

  // Add Availability Slot
  const addAvailabilitySlot = (slot: Omit<AvailabilitySlot, 'id'>) => {
    const newSlot: AvailabilitySlot = {
      ...slot,
      id: `slot-${Date.now()}`,
    }
    setAvailabilitySlots((prev) => [...prev, newSlot])
  }

  // Update Availability Slot
  const updateAvailabilitySlot = (id: string, data: Partial<AvailabilitySlot>) => {
    setAvailabilitySlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    )
  }

  // Delete Availability Slot
  const deleteAvailabilitySlot = (id: string) => {
    setAvailabilitySlots((prev) => prev.filter((s) => s.id !== id))
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
  }

  // Matching Engine
  const runMatchingEngine = (criteria: ProviderMatchCriteria): ProviderMatchResult[] => {
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
